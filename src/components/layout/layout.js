import React from 'react';

import './layout.css';
import AppHeader from './app-header/app-header';
import AppSidebar from './app-sidebar/app-sidebar';
import AppFooter from './app-footer/app-footer';
import AppMainContent from './app-main-content/app-main-content';

function Layout() {
    return (
        <div className="app-layout">
            <AppHeader />
            <AppSidebar />
            <AppMainContent />
            <AppFooter />
        </div>
    ); 
}

export default Layout;
