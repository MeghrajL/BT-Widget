//
//  AQIBundle.swift
//  AQI
//
//  Created by Neosoft on 25/10/23.
//

import WidgetKit
import SwiftUI

@main
struct AQIBundle: WidgetBundle {
    var body: some Widget {
        AQI()
        AQILiveActivity()
    }
}
