//
//  ProfilePrivacyView.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//

import SwiftUI

public struct ProfilePrivacyView: View {
    @State private var isPrivacyZoneEnabled: Bool = true
    @State private var privacyRadiusMeters: Double = 500.0
    @State private var isAutoCleanTriggered: Bool = false
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            List {
                // Seksi Profil Mitra
                Section("Identitas Mitra & Armada EV") {
                    HStack(spacing: 14) {
                        Image(systemName: "person.crop.circle.fill")
                            .font(.system(size: 44))
                            .foregroundStyle(Color(uiColor: .systemBlue))
                        
                        VStack(alignment: .leading, spacing: 3) {
                            Text("Bang Rian")
                                .font(.headline)
                            Text("Mitra Kurir & Ojol Listrik DKI Jakarta")
                                .font(.caption)
                                .foregroundStyle(Color(uiColor: .secondaryLabel))
                            Text("ID: UJ-DRV-849102 • Pelat: B 4819 SXX")
                                .font(.caption2)
                                .foregroundStyle(Color(uiColor: .tertiaryLabel))
                        }
                    }
                    .padding(.vertical, 4)
                }
                
                // Seksi Privasi & Kepatuhan UU PDP No. 27/2022
                Section("Kepatuhan Privasi (UU PDP No. 27/2022)") {
                    Toggle("Zona Privasi Kediaman (500m)", isOn: $isPrivacyZoneEnabled)
                        .tint(Color(uiColor: .systemGreen))
                    
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Geofence Cloaking Otomatis")
                            .font(.subheadline)
                            .fontWeight(.medium)
                        Text("Sistem secara otomatis mengaburkan koordinat telemetri dalam radius 500 meter di sekitar titik tempat tinggal Anda. Lokasi rumah Anda tidak pernah dipublikasikan ke peta warga atau pihak ketiga.")
                            .font(.caption)
                            .foregroundStyle(Color(uiColor: .secondaryLabel))
                    }
                    .padding(.vertical, 2)
                    
                    HStack {
                        Text("Pseudonimisasi Spasial")
                        Spacer()
                        Text("Aktif (SHA-256 Salted)")
                            .font(.caption)
                            .foregroundStyle(Color(uiColor: .systemGreen))
                    }
                }
                
                // Seksi Manajemen Perangkat IoT & Pemeliharaan Sensor
                Section("Perangkat Clip-on & Sensor") {
                    HStack {
                        Text("Nomor Seri Hardware")
                        Spacer()
                        Text("UJ-EV-2026-X84")
                            .font(.callout)
                            .foregroundStyle(Color(uiColor: .secondaryLabel))
                    }
                    
                    HStack {
                        Text("Catu Daya LiFePO4")
                        Spacer()
                        Text("84% (Operasional > 14 Jam)")
                            .monospacedDigit()
                            .font(.callout)
                            .foregroundStyle(Color(uiColor: .systemGreen))
                    }
                    
                    HStack {
                        Text("Buffer Offline Lokal (Flash/SQLite)")
                        Spacer()
                        Text("0 Pending / 72 Jam Max")
                            .monospacedDigit()
                            .font(.callout)
                            .foregroundStyle(Color(uiColor: .secondaryLabel))
                    }
                    
                    Button(action: {
                        isAutoCleanTriggered = true
                    }) {
                        HStack {
                            Image(systemName: "fanblades.fill")
                            Text(isAutoCleanTriggered ? "Siklus Pembersihan Berjalan..." : "Jalankan Auto-Cleaning Laser SPS30")
                        }
                        .foregroundStyle(isAutoCleanTriggered ? Color(uiColor: .systemOrange) : Color(uiColor: .systemBlue))
                    }
                    .disabled(isAutoCleanTriggered)
                }
                
                // Seksi Tentang & Regulasi
                Section("Transparansi Metodologi") {
                    NavigationLink("Sertifikasi Sensor MCERTS Sensirion") {}
                    NavigationLink("Ketentuan Insentif & Anti-Cheat Engine") {}
                    NavigationLink("Kebijakan Retensi Data (14 Hari Raw Audit)") {}
                }
            }
            .navigationTitle("Profil & Privasi")
            .navigationBarTitleDisplayMode(.large)
        }
    }
}
