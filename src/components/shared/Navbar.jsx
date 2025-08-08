import React from 'react'
import {Link, useLocation} from 'react-router-dom'
import {FileText, X, Menu, Crown, LogOut, User, ChevronDown, ChevronUp, Settings} from 'lucide-react'
import { onboardingStore } from '../../stores/onboardingStore';

function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const location = useLocation();
    const isAuthPage = ['/login', '/signup', '/create-account'].includes(location.pathname);
    const isOnboardingPage = location.pathname.startsWith('/onboarding');
    const isLoggedIn = ['/dashboard', '/onboarding', '/generate/resume', '/generate/cover-letter', '/resume-editor'].includes(location.pathname);

    React.useEffect(() => {
        const handleWindowScroll = () => {
            setIsScrolled(window.scrollY > 10)
        };

        window.addEventListener("scroll", handleWindowScroll);

        return (() => window.removeEventListener("scroll", handleWindowScroll));
    });

    const {
        originalData
    } = onboardingStore();

    if (isAuthPage) return null;

    const handleLogout = () => {
        // Handle logout logic here
        console.log('Logout clicked');
        // Redirect to home page or login page
        localStorage.clear();
        window.location.href = '/';
    };

    const handleNavMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }



    // Profile Dropdown Menu JSX (only for desktop dropdown, not mobile)
    const ProfileDropdownMenu = (
        <div
            className="bg-gray-900 absolute right-0 mt-2 w-64 rounded-lg shadow-lg flex flex-col space-y-4 z-50 p-4 border-gray-600 border">
            <div className='space-x-2 px-4 py-1'>
                <h2 className='font-bold text-lg'>{originalData.name}</h2>
                <h4 className='text-base text-gray-400'>{originalData.email}</h4>
            </div>
            <hr className='text-gray-400'></hr>
            <div className='flex items-center space-x-2 px-4 py-1 cursor-pointer hover:bg-gray-800 rounded'>
                <Settings className='h-4 w-4'></Settings>
                <span>Manage Profile Data</span>
            </div>
            <div className='flex items-center space-x-2 px-4 py-1 cursor-pointer hover:bg-gray-800 rounded'
                 onClick={handleLogout}>
                <LogOut className='h-4 w-4 text-red-500'></LogOut>
                <span className='text-red-500'>Logout</span>
            </div>
        </div>
    );

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-sm py-4 shadow-md' : 'bg-transparent py-6'
            }`}>
            <div className='container mx-auto px-4 md:px-6 flex items-center justify-between'>
                <Link to={isLoggedIn ? '/dashboard' : '/'} className='flex flex-row items-center space-x-2'>
                    <FileText className='h-8 w-8 text-indigo-500'></FileText>
                    <span className='text-xl font-bold'>ResumeX</span>
                </Link>
                {/* Desktop Nav Menu */}
                {
                    !isOnboardingPage && <nav className='hidden md:flex flex-row items-center space-x-8 relative'>
                        {
                            isLoggedIn && !isOnboardingPage ?
                                <>
                                    <button disabled={true}
                                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-full transition-all transform hover:scale-105 cursor-not-allowed">
                                        <Crown className="h-4 w-4"/>
                                        <span className="text-sm font-medium">Upgrade to PRO</span>
                                    </button>
                                    <div className="relative">
                                        <button className='' onClick={handleNavMenu}>
                                            {isMenuOpen ? (
                                                isLoggedIn ? (
                                                <span className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-800 transition-colors cursor-pointer">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-white" />
                                                    </div>
                                                    <ChevronUp className="h-4 w-4 text-gray-400 transition-transform" />
                                                </span>
                                                ) : (
                                                <X size={24} />
                                                )
                                            ) : (
                                                isLoggedIn ? (
                                                <span className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-800 transition-colors cursor-pointer">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-white" />
                                                    </div>
                                                    <ChevronDown className="h-4 w-4 text-gray-400 transition-transform" />
                                                </span>
                                                ) : (
                                                <Menu size={24} />
                                                )
                                            )}
                                        </button>
                                        {/* Desktop Profile Dropdown - only for desktop */}
                                        {isMenuOpen && isLoggedIn && (
                                            <div className="hidden md:block absolute right-0 top-full">
                                                {ProfileDropdownMenu}
                                            </div>
                                        )}
                                    </div>
                                </>
                                :
                                !isOnboardingPage && <>
                                    <a href='#how-it-works' className='text-gray-300 hover:text-white transition-colors'>How
                                        It Works</a>
                                    <a href='#features'
                                       className='text-gray-300 hover:text-white transition-colors'>Features</a>
                                    <a href='#pricing'
                                       className='text-gray-300 hover:text-white transition-colors'>Pricing</a>
                                    <a href='#faq' className='text-gray-300 hover:text-white transition-colors'>FAQ</a>
                                    <Link to='/login'
                                          className='py-2 px-4 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-center'
                                          onClick={handleNavMenu}>Sign In</Link>
                                    <Link to='/signup'
                                          className='py-2 px-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all text-center'
                                          onClick={handleNavMenu}>Get Started Free</Link>
                                </>
                        }
                    </nav>
                }
                {
                    !isOnboardingPage &&
                    <button className='md:hidden' onClick={handleNavMenu}>{isMenuOpen ? isLoggedIn ?
                        <span
                            className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                        <div
                            className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white"/>
                        </div>
                        <ChevronUp className={`h-4 w-4 text-gray-400 transition-transform`}/>
                    </span> : <X size={24}></X> : isLoggedIn ?
                        <span
                            className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                        <div
                            className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white"/>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform`}/>
                    </span> : <Menu size={24}></Menu>}</button>
                }
            </div>
            {/* Mobile Nav Menu */}
            {isMenuOpen && (
                <nav
                    className='md:hidden bg-gray-900 absolute top-full left-0 right-0 p-4 shadow-lg flex flex-col space-y-4'>
                    {
                        isLoggedIn ?
                            <>
                                {/* Only show dropdown content in mobile, not as a floating box */}
                                <div className="flex flex-col space-y-4">
                                    <div className='space-x-2 px-4 py-1'>
                                        <h2 className='font-bold text-lg'>John Doe</h2>
                                        <h4 className='text-base text-gray-400'>john.doe@example.com</h4>
                                    </div>
                                    <button disabled={true}
                                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-full transition-all transform hover:scale-105 cursor-not-allowed w-fit">
                                        <Crown className="h-4 w-4"/>
                                        <span className="text-sm font-medium">Upgrade to PRO</span>
                                    </button>
                                    <hr className='text-gray-400'></hr>
                                    <div
                                        className='flex items-center space-x-2 px-4 py-1 cursor-pointer hover:bg-gray-800 rounded'>
                                        <Settings className='h-4 w-4'></Settings>
                                        <span>Manage Profile Data</span>
                                    </div>
                                    <div
                                        className='flex items-center space-x-2 px-4 py-1 cursor-pointer hover:bg-gray-800 rounded'
                                        onClick={handleLogout}>
                                        <LogOut className='h-4 w-4 text-red-500'></LogOut>
                                        <span className='text-red-500'>Logout</span>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <a href='#how-it-works'
                                   className='text-gray-300 hover:text-white transition-colors py-2 px-4'
                                   onClick={handleNavMenu}>How It Works</a>
                                <a href='#features'
                                   className='text-gray-300 hover:text-white transition-colors py-2 px-4'
                                   onClick={handleNavMenu}>Features</a>
                                <a href='#pricing'
                                   className='text-gray-300 hover:text-white transition-colors py-2 px-4'
                                   onClick={handleNavMenu}>Pricing</a>
                                <a href='#faq' className='text-gray-300 hover:text-white transition-colors py-2 px-4'
                                   onClick={handleNavMenu}>FAQ</a>
                                <Link to='/login'
                                      className='py-2 px-4 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-center'
                                      onClick={handleNavMenu}>Sign In</Link>
                                <Link to='/signup'
                                      className='py-2 px-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all text-center'
                                      onClick={handleNavMenu}>Get Started Free</Link>
                            </>
                    }
                </nav>
            )}
        </header>
    )
}

export default Navbar