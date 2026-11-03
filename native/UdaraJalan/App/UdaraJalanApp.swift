//
//  UdaraJalanApp.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//

import SwiftUI

@main
struct UdaraJalanApp: App {
    @State private var selectedTab: TabDestination = .mitraDashboard
    
    enum TabDestination: Hashable {
        case mitraDashboard
        case publicMap
        case wallet
        case profilePrivacy
    }
    
    var body: some Scene {
        WindowGroup {
            TabView(selection: $selectedTab) {
                MitraDashboardView()
                    .tabItem {
                        Label("Mitra", systemImage: "steeringwheel")
                    }
                    .tag(TabDestination.mitraDashboard)
                
                PublicMapView()
                    .tabItem {
                        Label("Peta Warga", systemImage: "map.fill")
                    }
                    .tag(TabDestination.publicMap)
                
                WalletView()
                    .tabItem {
                        Label("Dompet", systemImage: "creditcard.fill")
                    }
                    .tag(TabDestination.wallet)
                
                ProfilePrivacyView()
                    .tabItem {
                        Label("Privasi", systemImage: "person.crop.circle")
                    }
                    .tag(TabDestination.profilePrivacy)
            }
            .tint(Color(uiColor: .systemBlue))
        }
    }
}
