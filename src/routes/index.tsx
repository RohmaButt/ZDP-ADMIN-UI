import * as React from "react";
import { Routes as AppRoutes, Route } from "react-router-dom";
import { NotFound, Users } from "../pages";
import Members from "../pages/Members";
import AppMembers from "../pages/AppMembers";
import Companies from "../pages/Companies";
import Groups from "../pages/Companies/groups";
import CompanyMembers from "../pages/Companies/members";
import Dashboard from "../pages/Dashboard";
import UserProfile from "../pages/UserProfile";
import Search from "../pages/Search";
import NotificationHistory from "../pages/NotificationHistory";
import NotificationSettings from "../pages/NotificationSettings";
import Test from "../pages/Test";

const Routes = () => {
  return (
    <AppRoutes>
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/userprofile" element={<UserProfile />} />
      <Route path="/admin/members" element={<Members />} />
      <Route path="/admin/test" element={<Test />} />
      <Route path="/admin/companies" element={<Companies />} />
      <Route path="/admin/companies/:companyName" element={<Groups />} />
      <Route
        path="/admin/companies/:companyName/:groupName"
        element={<CompanyMembers />}
      />
      <Route path="/admin/members/:app" element={<AppMembers />} />
      <Route path="/admin/search" element={<Search />} />
      <Route
        path="/admin/search/companies/:companyName/:groupName"
        element={<CompanyMembers />}
      />
      <Route path="/admin/search/companies/:companyName" element={<Groups />} />
      <Route path="/admin/history" element={<NotificationHistory />} />
      <Route
        path="/admin/notificationsettings"
        element={<NotificationSettings />}
      />
      {/* add user profile roting here to complete search */}
      <Route path="*" element={<NotFound />} />
    </AppRoutes>
  );
};

export default Routes;
