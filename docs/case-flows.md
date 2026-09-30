# Eticket user flows (from the Miro board "Eticket redesign 2026: user flows")

Board: https://miro.com/app/board/uXjVHhQTOfI=/
Legend: yellow = steps, blue = decisions, green = start and end.

## 1. Onboarding
```mermaid
flowchart TD
    o1([Open app]) --> o2[Language: Ukrainian or English] --> o3[Sign in: phone code, Apple or Google] --> o4{{Have an Eticket card?}}
    o2 -.-> o9[Just visiting? Buy a ticket without an account]
    o4 -->|Yes| o5[Add card: hold card to phone or enter card ID] --> o6{{Reduced fare card?}}
    o6 -->|Yes| o7[Confirm status: student or other benefit] --> o10[Add to Apple or Google Wallet]
    o6 -->|No| o10
    o4 -->|No| o8[Create a virtual Eticket] --> o10
    o10 --> o11[Allow location for nearby stops] --> o12{{Location allowed?}}
    o12 -->|Yes| o14([Home])
    o12 -->|No| o13[Pick home stop manually] --> o14
```

## 2. Pay for a ride
```mermaid
flowchart TD
    p1([At the turnstile or validator]) --> p2[Hold phone to validator: Wallet express mode, no unlock, works offline] --> p3{{Enough balance?}}
    p3 -->|No| p5[Declined: not enough balance, top-up button] --> p6[One-tap top-up with Apple or Google Pay] --> p2
    p3 -->|Yes| p9{{Transfer within window?}}
    p9 -->|Yes| p10[Transfer free, shown on success] --> p4[Success: fare, new balance, transfer window]
    p9 -->|No| p4
    p4 --> p7{{Traveling with others?}}
    p7 -->|Yes| p8[Tap again for each extra passenger] --> p3
    p7 -->|No| p11([Ride])
```

## 3. Cards, top-up, auto top-up and transfer
```mermaid
flowchart TD
    t1([Card tab or low balance alert]) --> t0[Swipe between cards: main, family, virtual] --> t2[Card: balance, trips left at current fare] --> t3{{What to do?}}
    t3 -->|Top up| t4[Top up: amount chips 50, 100, 200 or custom] --> t5[Pay: Apple Pay, Google Pay or saved card] --> t6{{Payment OK?}}
    t6 -->|No| t7[Error: what happened and try another method] --> t5
    t6 -->|Yes| t8[Success: new balance, receipt] --> t13([Balance updated])
    t3 -->|Auto top-up| t9[Auto top-up: when below amount, add amount] --> t5
    t3 -->|Transfer| t10[Transfer to another card: family member] --> t11[Pick contact card or enter card number] --> t12[Confirm amount with Face ID] --> t13
```

## 4. Nearby, live arrivals, map and timetable
```mermaid
flowchart TD
    n1([Open Home]) --> n3{{Location allowed?}}
    n3 -->|Yes| n2[Nearest station and stops with live arrivals: Tram 27 in 3 min] --> n14{{List or map?}}
    n3 -->|No| n4[Search stop or line] --> n5
    n14 -->|List| n5[Stop detail: all lines, next arrivals]
    n14 -->|Map| n15[Map mode: all vehicles nearby, filter by transport type] --> n5
    n5 --> n11{{Live data available?}}
    n11 -->|Yes| n6[Line detail: vehicles on map, all stops]
    n11 -->|No| n12[Show timetable times, marked as scheduled] --> n6
    n6 --> n16[Full timetable for the day: weekday or weekend]
    n6 --> n7{{Arrival soon?}}
    n7 -->|No| n8[Notify me 5 min before]
    n7 -->|Yes| n9[Walk to stop] --> n13([Go to Pay for a ride])
    n5 --> n10[Save stop as favorite]
```

## 5. Route from A to B
```mermaid
flowchart TD
    r1([Where to?]) --> r14[Recent and favorite routes: one tap to reuse] --> r6
    r1 --> r2[From: current location by default] --> r3[To: search, saved places Home and Work, or the metro map] --> r4[Filters: transport types, fewer transfers, less walking, step-free] --> r5[Options: total time, transfers, walking, total fare] --> r6[Route detail: steps with live arrivals] --> r7{{Enough balance for the trip?}}
    r7 -->|No| r8[Top up before you go] --> r9[Start trip: live progress]
    r7 -->|Yes| r9
    r9 --> r15{{Service change on the route?}}
    r15 -->|Yes| r16[Alert and alternative route] --> r9
    r15 -->|No| r10[Notify: get off at next stop] --> r11{{Save route?}}
    r11 -->|Yes| r12[Add to favorites] --> r13([Arrived])
    r11 -->|No| r13
```

## 6. Visitor: ride without a card
```mermaid
flowchart TD
    v1([Open app in English]) --> v2[Just visiting? Skip sign-in] --> v3[Choose ticket: single ride, 1 day, 3 days] --> v4[Price and what is included: all transport types] --> v5[Pay with Apple or Google Pay] --> v6[Ticket added to Wallet] --> v7[Hold phone to validator like locals do] --> v9{{Ticket expired?}}
    v6 --> v8[Ticket screen: valid until, rides]
    v9 -->|Yes| v10[Buy another or create an account] --> v3
    v9 -->|No| v11([Ride])
```

## 7. Trips, receipts and account
```mermaid
flowchart TD
    a1([Profile]) --> a2[Trips: date, line, stop, fare] --> a3[Monthly spending summary]
    a2 --> a4[Receipts: share]
    a1 --> a5[My cards: add, rename, remove] --> a6{{Card lost?}}
    a6 -->|Yes| a7[Block card, move balance to a new card]
    a1 --> a8[Reduced fare status and expiry date]
    a1 --> a9[Payment methods and auto top-up]
    a1 --> a10[Notifications: low balance, arrivals, service changes]
    a1 --> a11[Language, appearance and accessibility]
    a1 --> a12[Delete account]
```

## 8. Problems and special cases
```mermaid
flowchart TD
    s1([Something went wrong or changed]) --> s2{{What happened?}}
    s2 -->|Wrong charge| s3[Trip in history: Report a problem] --> s4[Reason: charged twice, gate did not open, wrong fare] --> s5[Auto check: duplicate taps within 1 min refunded instantly] --> s18([Resolved])
    s4 --> s6[Other cases: request sent, answer within 3 days] --> s18
    s2 -->|New phone| s7[New phone: sign in, card moves with balance] --> s8[Old phone card is deactivated] --> s18
    s2 -->|Reduced fare ends| s9[Reduced fare expires in 14 days: reminder] --> s10[Renew: upload new document] --> s11{{Approved?}}
    s11 -->|Yes| s12[Reduced fare extended] --> s18
    s11 -->|No| s13[Standard fare applies, reason shown] --> s18
    s2 -->|Plastic to phone| s14[Moving to phone: hold plastic card to phone] --> s15[Move balance to virtual card, block plastic] --> s18
    s2 -->|Service change| s16[Service change: stop closed or detour alert] --> s17[Affected saved routes marked, alternative suggested] --> s18
```
