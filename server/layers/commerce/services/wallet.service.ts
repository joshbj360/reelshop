import { walletRepository } from '../repositories/wallet.repository'
import { auditService } from '../../shared/audit/audit.service'
import { UserError } from '../../profile/types/user.types'

export const walletService = {
  async getWallet(sellerId: string) {
    const wallet = await walletRepository.getOrCreateWallet(sellerId)
    const stats = await walletRepository.getWalletStats(wallet.id)
    return { wallet, stats }
  },

  async getTransactions(sellerId: string, limit = 20, offset = 0) {
    const wallet = await walletRepository.getOrCreateWallet(sellerId)
    const [transactions, total] = await Promise.all([
      walletRepository.getTransactions(wallet.id, limit, offset),
      walletRepository.countTransactions(wallet.id),
    ])
    return { transactions, total, limit, offset }
  },

  async addFunds(
    sellerId: string,
    amount: number,
    ipAddress: string,
    userAgent: string,
  ) {
    if (amount <= 0)
      throw new UserError(
        'INVALID_AMOUNT',
        'Amount must be greater than 0',
        400,
      )

    const wallet = await walletRepository.getOrCreateWallet(sellerId)
    await walletRepository.incrementBalance(wallet.id, amount)
    await walletRepository.createTransaction(wallet.id, {
      amount,
      type: 'CREDIT',
      description: 'Funds added to wallet',
    })

    await auditService.logUserAction({
      userId: sellerId,
      action: 'WALLET_FUNDED',
      resource: 'SellerWallet',
      resourceId: wallet.id,
      reason: 'Added funds',
      changes: { amount },
      ipAddress,
      userAgent,
    })

    return walletRepository.getWalletBySellerId(sellerId)
  },

  async withdraw(
    sellerId: string,
    amount: number,
    bankAccount: any,
    ipAddress: string,
    userAgent: string,
  ) {
    if (amount <= 0)
      throw new UserError(
        'INVALID_AMOUNT',
        'Amount must be greater than 0',
        400,
      )

    const wallet = await walletRepository.getOrCreateWallet(sellerId)
    if (wallet.balance < amount) {
      throw new UserError(
        'INSUFFICIENT_BALANCE',
        'Insufficient wallet balance',
        400,
      )
    }

    await walletRepository.decrementBalance(wallet.id, amount)
    const payout = await walletRepository.createPayout(wallet.id, {
      amount,
      bank_account: bankAccount,
    })
    await walletRepository.createTransaction(wallet.id, {
      amount,
      type: 'DEBIT',
      description: `Withdrawal request #${payout.id.slice(0, 8)}`,
    })

    await auditService.logUserAction({
      userId: sellerId,
      action: 'WALLET_WITHDRAWAL',
      resource: 'SellerWallet',
      resourceId: wallet.id,
      reason: 'Withdrawal requested',
      changes: { amount },
      ipAddress,
      userAgent,
    })

    return {
      payout,
      wallet: await walletRepository.getWalletBySellerId(sellerId),
    }
  },
}
