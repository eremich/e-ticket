# Eticket — case study draft (for review)

English, same structure as the Patronim case. Placeholders in [brackets].
Numbers are either facts of the redesign or launch targets labelled as targets. No invented research data.

---

## Cover

**Title:** Eticket
**One-liner:** Pay for a ride with one tap and know when your tram arrives: Kharkiv's travel card, redesigned around the two moments that matter.

**Facts (highlights)**
- **5 → 1** — steps to pay at the turnstile, now a single tap with the phone
- **68.8%** — of the riders we researched in 2020 rode with a plastic card
- **3 lines, 30 stations** — the Kharkiv metro, with the current names after the 2022–2024 renaming
- **14 scenarios** — clickable end to end, from a declined tap to a lost card

**Case facts:** Role — Product designer · Team — me and two developers (2020), me alone for the 2026 redesign · Platform — iOS · Location — Kharkiv, Ukraine · Year — 2020 / 2026

---

## Overview

**Headline:** In 2020 we put Kharkiv's travel card into a phone. In 2026 I made paying take one tap.

Eticket is Kharkiv's electronic travel card for the metro, trams, trolleybuses and buses. You top it up, and each ride is charged at the turnstile or the validator.

In 2020 I was the product designer on a team of three, with two developers. We shipped the first Eticket app: the card in your phone, top-ups, nearby stops, route search and trip history.

In 2026 I audited our own app and redesigned it around the two moments a rider actually cares about: getting through the turnstile, and knowing when the next tram comes. I built the redesign as a working prototype with AI, with the design system in Storybook.

---

## The problem

**Headline:** Riders had four problems. Our app solved them on paper, not at the turnstile.

**What riders told us in interviews, 2020**
1. **Cash and queues.** Topping up a plastic card meant a line at a terminal.
2. **Paper and plastic.** Paper tickets and cards, used once and thrown away.
3. **Visitors.** If you are not local, buying a ticket is hard.
4. **Waiting.** Long, unpredictable waits at stops.

**What I found in our own app (audit, 2026)**
- **Paying took five steps** — on "Pay for Travel": pick the transport type, passengers, bags, check the total, confirm, then hold the phone to the terminal. At the turnstile, the moment with the least patience.
- **Stops without arrivals** — Home listed nearby stops but not when the next vehicle comes, although waiting was one of the four problems.
- **Visitors could not start** — onboarding asked for the number of a plastic card they don't have.
- **No Apple Pay or Google Pay** — top-up offered a linked bank card and a custom keypad, while our research showed riders already pay by phone.
- **Two places to search a route** — Home and "A to B"; tabs named "Cards" and "Payments" for the same thing.

---

## Research

**Headline:** We started with riders, not screens.

In 2020, before designing the first app, we interviewed Kharkiv riders and mapped a morning commute from home to work. The four problems above came from those conversations.

**Key interview quotes** (spelling corrected)
- "I have no way of knowing my card's balance, I usually need to guess."
- "I hate the huge queue to the ticket terminal in the morning!"
- "I'm constantly late for work because I was fumbling with my card and cash, then spent a lot of time near the ticket terminal!"
- "I always forget to top up my Eticket card."

**Customer journey: getting to work**
| | Goal | Route | Transport | Payment | Service |
|---|---|---|---|---|---|
| Doing | Often late, rushing to catch transport | Decides how to get to work, checks Google Maps | Waits at the trolleybus stop, changes to the metro | Pays in the trolleybus and the metro | Buys a single ticket or tops up at a terminal |
| Pain | Trams and trolleybuses break down; walks to the metro | No schedule and no routes on the Eticket website | Can't check the card balance at the stop; crowds at the door | Top-up only at a terminal | Slow, difficult processes |
| Feels | Late and irritable all day | Doesn't know the route | Struggles to get on | Can't pay, or struggles to | Loses time buying and topping up |

**Who we designed for**
- Riders who use public transport and a smartphone every day, mostly students and office workers.
- **68.8%** of them rode with a plastic card: the green Eticket or the student travel card.
- Card and phone payments were common next to cash; the metro and buses were used most.

**The priority we set in 2020:** easy payment and top-up, no cash and no paper tickets; see the travel balance; pay by smartphone; link a bank card; move money to another Eticket card; track transport, see schedules, find the nearest stops and build a route from A to B.

In 2026 I went back to these findings and audited our shipped app against them, screen by screen.

---

## Users

**Headline:** Three riders, three very different mornings.

- **Daily commuter** — same two or three routes every day. *Needs:* through the turnstile fast, and not to miss the tram.
- **Student with a reduced fare** — price-sensitive, rides daily. *Needs:* the reduced fare to just work, and to know when it expires.
- **Visitor** — no card, may not read Ukrainian. *Needs:* a ticket in two minutes and simple directions.

---

## Goals

**For riders**
1. Pay in one tap, even offline, without unlocking the phone.
2. See when the next metro, tram or bus comes, right on Home.
3. Never get stuck at the turnstile with no balance.
4. Ride as a visitor without an account or a plastic card.

**For the city and the operator**
1. Fewer paper tickets and shorter lines at top-up terminals.
2. More rides paid digitally.
3. Higher satisfaction through predictable arrivals.

**How we'd measure it (launch targets, to set with the operator)**
- Share of rides paid by phone — *target: [60%] in the first year*
- Declined taps per 1,000 rides — *target: down by [half]*
- Top-ups in the app vs terminals — *target: [70%] in the app*
- Visitor time from install to first ride — *target: under [2 minutes]*

---

## Principles

1. **The turnstile moment is sacred.** Nothing between the person and the gate.
2. **Arrivals, not stops.** A stop is only useful with the time of the next vehicle.
3. **Money is visible.** Balance, fare and trips left, one glance away.
4. **Works for someone who just arrived.** English, no account, no card.

---

## Key decisions

1. **Tap to pay through Wallet express mode.** No app to open, no unlock, works offline. *Premise: validators on all transport accept NFC.*
2. **A declined tap is also the fix.** "₴6 left, fare ₴8" with "Top up ₴100 with Apple Pay" right there, then tap again.
3. **Live arrivals on Home.** The nearest metro station first, then "Tram 27 · 3 min" for each stop nearby, with "Notify me 5 min before".
4. **The transfer window after paying.** "Free transfer until 09:14" removes a common worry.
5. **Routes show the total fare** and check the balance before you leave: "Your balance doesn't cover this trip".
6. **Visitor tickets without an account,** straight into Wallet: single ride, 1 day, 3 days.
7. **Auto top-up and lost-card recovery,** so the balance never becomes a problem.
8. **Four clear tabs:** Home, Routes, Card, Profile. One place to search a route.

---

## Flows

**Headline:** Eight flows, mapped before a screen was drawn.
Onboarding · Pay for a ride · Cards and top-up · Nearby and live arrivals · Route A to B · Visitor · Trips and account · Problems and special cases.
(Images: the Miro board, one per flow.)

---

## Before and after

One pair per audit finding (original screen with the problem marked → new screen):
1. Five steps to pay → Hold near reader, Paid / Declined with top-up
2. Stops without arrivals → Home with the nearest station and live chips
3. Onboarding needs a plastic card → Welcome with "Just visiting? Buy a ticket", visitor tickets
4. Top-up with a custom keypad → amount chips and Apple Pay
5. Duplicate route search → one "Where to?" into Routes, options with the fare

---

## The morning commute, clicked end to end

₴6 on the card → Routes → Work: metro line 2, transfer, line 1, 24 min, ₴8, "balance doesn't cover this trip" → tap at Saltivska: declined → top up ₴100 with Apple Pay → tap again: paid, ₴98, free transfer until 09:14 → live trip on the metro map → "Transfer at Istorychnyi Muzei to line 1", no new tap → "Vokzalna is next" → at the exit, Home suggests "Tram 7 · 4 min".

---

## Hard states

**Headline:** The screens nobody asks for are the ones that build trust.
Declined tap · Offline ("Works offline. Balance syncs later.") · No live data ("Scheduled 08:20") · Service change with an alternative · Charged twice, refunded instantly · Lost card, balance moved to a virtual card · Reduced fare expiring · Visitor ticket expired.

---

## Design system

**Headline:** Quiet interface, loud transport.
- Near black and white with one blue accent; the transport code is the only other color: metro lines 1 red, 2 blue, 3 green; trams, trolleybuses and buses by color, always with an icon and a number.
- A true black dark theme with the vivid iOS system colors.
- iOS patterns: large titles, a floating glass tab bar, sheets with detents, inset grouped lists.
- Onest for Latin and Cyrillic. Every component in Storybook, in both themes and both languages.

---

## Links
- Prototype: https://e-ticket-six-taupe.vercel.app
- Storybook: https://e-ticket-six-taupe.vercel.app/storybook/
