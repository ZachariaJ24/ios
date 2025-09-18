//
//  SecretChelSocietyEventsManager.h
//  SecretChelSociety
//
//  Created by Mahusai on 6/14/24.
//  Copyright © 2024 GoNative.io LLC. All rights reserved.
//

#import "LEANWebViewController.h"

NS_ASSUME_NONNULL_BEGIN

@interface SecretChelSocietyEventsManager : NSObject
- (instancetype)initWithWebViewController:(LEANWebViewController *)wvc;
- (void)triggerEvent:(NSString *)eventName data:(NSDictionary *)data;
- (void)subscribeEvent:(NSString *)eventName;
- (void)unsubscribeEvent:(NSString *)eventName;
- (BOOL)isSubscribedForEvent:(NSString *)eventName;
@end

NS_ASSUME_NONNULL_END
