//
//  WalletView.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//  Design Standards: Native Clean System Guidelines (DESIGN.md / DESIGN_SYSTEM.md)
//

import SwiftUI

public struct WalletView: View {
    @State private var totalPoints: Int = 14850
    @State private var rupiahBalance: Int = 1782000
    @State private var isWithdrawPresented: Bool = false
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    // Card Saldo Dompet Utama (Clean Surface White #FFFFFF)
                    walletBalanceCard
                    
                    // Tombol Aksi Cepat (Tarik Saldo, Tukar Voucher Servis EV)
                    quickActionGrid
                    
                    // Rincian Riwayat Insentif Sesi Perjalanan (Clean Surface #FFFFFF)
                    tripRewardHistorySection
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)
                .padding(.bottom, 24)
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Dompet & Reward")
            .navigationBarTitleDisplayMode(.large)
        }
    }
    
    private var walletBalanceCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text("Saldo Siap Ditarik")
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                Spacer()
                Image(systemName: "creditcard.circle.fill")
                    .font(.title3)
                    .foregroundStyle(Color(uiColor: .systemGreen))
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text("Rp\(rupiahBalance.formatted())")
                    .monospacedDigit()
                    .font(.system(size: 34, weight: .bold, design: .default))
                    .foregroundStyle(Color(uiColor: .label))
                
                Text("\(totalPoints.formatted()) Poin Terverifikasi")
                    .monospacedDigit()
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundStyle(Color(uiColor: .systemGreen))
            }
            
            Divider()
            
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Tarif Dasar Standar")
                        .font(.caption2)
                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                    Text("Rp120 / km")
                        .font(.caption)
                        .fontWeight(.semibold)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 2) {
                    Text("Zona Multiplier (H3)")
                        .font(.caption2)
                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                    Text("Rp240 / km (2x)")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundStyle(Color(uiColor: .systemOrange))
                }
            }
        }
        .padding(18)
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        .shadow(color: Color.black.opacity(0.04), radius: 20, y: 4)
        .overlay(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .stroke(Color.black.opacity(0.04), lineWidth: 1)
        )
    }
    
    private var quickActionGrid: some View {
        HStack(spacing: 12) {
            Button(action: {
                isWithdrawPresented = true
            }) {
                HStack {
                    Image(systemName: "arrow.down.to.line.compact")
                    Text("Tarik Saldo")
                }
                .font(.headline)
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Color(uiColor: .systemBlue))
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            }
            
            Button(action: {}) {
                HStack {
                    Image(systemName: "bolt.batteryblock.fill")
                    Text("Voucher Swap EV")
                }
                .font(.headline)
                .foregroundStyle(Color(uiColor: .systemGreen))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Color(uiColor: .systemGreen).opacity(0.12))
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            }
        }
    }
    
    private var tripRewardHistorySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Riwayat Perjalanan Tervalidasi")
                .font(.headline)
                .foregroundStyle(Color(uiColor: .label))
            
            VStack(spacing: 0) {
                tripHistoryRow(
                    title: "Sesi Pagi: Senayan - Sudirman",
                    timeText: "Hari ini, 09:40 • 14.2 Km Valid",
                    amountText: "+Rp2.424",
                    isBonusMultiplier: true
                )
                
                Divider().padding(.leading, 16)
                
                tripHistoryRow(
                    title: "Sesi Siang: Kuningan - Rasuna Said",
                    timeText: "Hari ini, 12:15 • 9.8 Km Valid",
                    amountText: "+Rp1.176",
                    isBonusMultiplier: false
                )
                
                Divider().padding(.leading, 16)
                
                tripHistoryRow(
                    title: "Sesi Kemarin: Thamrin - Harmoni",
                    timeText: "Kemarin, 17:30 • 18.5 Km Valid",
                    amountText: "+Rp2.220",
                    isBonusMultiplier: false
                )
            }
            .background(Color(uiColor: .secondarySystemGroupedBackground))
            .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
            .shadow(color: Color.black.opacity(0.04), radius: 20, y: 4)
            .overlay(
                RoundedRectangle(cornerRadius: 24, style: .continuous)
                    .stroke(Color.black.opacity(0.04), lineWidth: 1)
            )
        }
    }
    
    private func tripHistoryRow(
        title: String,
        timeText: String,
        amountText: String,
        isBonusMultiplier: Bool
    ) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text(title)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(Color(uiColor: .label))
                    
                    if isBonusMultiplier {
                        Text("2x Zona")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundStyle(Color(uiColor: .systemOrange))
                            .padding(.horizontal, 4)
                            .padding(.vertical, 1)
                            .background(Color(uiColor: .systemOrange).opacity(0.12))
                            .clipShape(Capsule())
                    }
                }
                
                Text(timeText)
                    .font(.caption)
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
            }
            
            Spacer()
            
            Text(amountText)
                .monospacedDigit()
                .font(.callout)
                .fontWeight(.bold)
                .foregroundStyle(Color(uiColor: .systemGreen))
        }
        .padding(16)
    }
}
