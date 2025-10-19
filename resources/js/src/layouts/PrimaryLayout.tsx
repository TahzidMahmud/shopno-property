import { Suspense, useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header'
import Footer from '../components/Footer'
const PrimaryLayout = () => {


    return (
        <>
            <Header />
            <main>
                <Suspense fallback={<div className="min-h-screen"></div>}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />

        </>
    );
};

export default PrimaryLayout;
