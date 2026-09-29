import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Shell } from './Shell';
import { Home } from '../screens/home/Home';
import { StopDetail } from '../screens/home/StopDetail';
import { LineDetail } from '../screens/home/LineDetail';
import { Timetable } from '../screens/home/Timetable';
import { MetroScreen } from '../screens/home/MetroScreen';
import { CardTab } from '../screens/card/CardTab';
import { TopUp, TopUpDone } from '../screens/card/TopUp';
import { AutoTopUp } from '../screens/card/AutoTopUp';
import { Transfer } from '../screens/card/Transfer';
import { Routes as RoutesTab } from '../screens/routes/Routes';
import { RouteDetail } from '../screens/routes/RouteDetail';
import { LiveTrip } from '../screens/routes/LiveTrip';
import { Welcome } from '../screens/onboarding/Welcome';
import { SignIn } from '../screens/onboarding/SignIn';
import { HasCard } from '../screens/onboarding/HasCard';
import { AddCard } from '../screens/onboarding/AddCard';
import { Virtual } from '../screens/onboarding/Virtual';
import { Reduced } from '../screens/onboarding/Reduced';
import { WalletStep } from '../screens/onboarding/WalletStep';
import { HomeStop, Location } from '../screens/onboarding/Location';
import { NewPhone } from '../screens/onboarding/NewPhone';
import { Profile } from '../screens/profile/Profile';
import { Trips } from '../screens/profile/Trips';
import { TripDetail } from '../screens/profile/TripDetail';
import { Report } from '../screens/profile/Report';
import { RequestDetail } from '../screens/profile/RequestDetail';
import { Cards } from '../screens/profile/Cards';
import { CardDetail } from '../screens/profile/CardDetail';
import { LostCard } from '../screens/profile/LostCard';
import { ToPhone } from '../screens/profile/ToPhone';
import { ReducedFare } from '../screens/profile/ReducedFare';
import { Notifications } from '../screens/profile/Notifications';
import { Accessibility } from '../screens/profile/Accessibility';
import { Visitor } from '../screens/visitor/Visitor';
import { VisitorTicketScreen } from '../screens/visitor/VisitorTicketScreen';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="stop/:id" element={<StopDetail />} />
        <Route path="line/:id" element={<LineDetail />} />
        <Route path="timetable/:id" element={<Timetable />} />
        <Route path="metro" element={<MetroScreen />} />
        <Route path="routes" element={<RoutesTab />} />
        <Route path="routes/detail" element={<RouteDetail />} />
        <Route path="routes/live" element={<LiveTrip />} />
        <Route path="card" element={<CardTab />} />
        <Route path="card/top-up" element={<TopUp />} />
        <Route path="card/top-up/done" element={<TopUpDone />} />
        <Route path="card/auto" element={<AutoTopUp />} />
        <Route path="card/transfer" element={<Transfer />} />
        <Route path="onboarding" element={<Welcome />} />
        <Route path="onboarding/sign-in" element={<SignIn />} />
        <Route path="onboarding/card" element={<HasCard />} />
        <Route path="onboarding/add-card" element={<AddCard />} />
        <Route path="onboarding/virtual" element={<Virtual />} />
        <Route path="onboarding/reduced" element={<Reduced />} />
        <Route path="onboarding/wallet" element={<WalletStep />} />
        <Route path="onboarding/new-phone" element={<NewPhone />} />
        <Route path="onboarding/location" element={<Location />} />
        <Route path="onboarding/home-stop" element={<HomeStop />} />
        <Route path="visitor" element={<Visitor />} />
        <Route path="visitor/ticket" element={<VisitorTicketScreen />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/trips" element={<Trips />} />
        <Route path="profile/trips/:id" element={<TripDetail />} />
        <Route path="profile/trips/:id/report" element={<Report />} />
        <Route path="profile/requests/:id" element={<RequestDetail />} />
        <Route path="profile/cards" element={<Cards />} />
        <Route path="profile/cards/:id" element={<CardDetail />} />
        <Route path="profile/cards/:id/lost" element={<LostCard />} />
        <Route path="profile/cards/:id/to-phone" element={<ToPhone />} />
        <Route path="profile/reduced" element={<ReducedFare />} />
        <Route path="profile/notifications" element={<Notifications />} />
        <Route path="profile/accessibility" element={<Accessibility />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
