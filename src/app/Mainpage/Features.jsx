import Link from 'next/link';

function MainFeatures() {
    return (
        <div className="bg-gray-700 p-4 min-h-screen">
            <div aria-hidden="true" className="absolute inset-0 h-max w-full m-auto grid grid-cols-2 -space-x-52 opacity-20">
                <div className="blur-[106px] h-56 bg-gradient-to-br from-purple-400 to-blue-700"></div>
                <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-indigo-600"></div>
            </div>
            <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
                <div className="md:w-2/3 lg:w-1/2 mt-12 text-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-secondary">
                        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd"></path>
                    </svg>
                    <h2 className="my-8 text-2xl font-bold text-white md:text-4xl">Benefits of Time Management</h2>
                    <p className="text-gray-300">Effective time management can greatly enhance your life and health. Here are some key benefits:</p>
                </div>
                <div className="mt-16 grid divide-x divide-y divide-gray-700 overflow-hidden rounded-3xl border text-gray-600 border-gray-700 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    <div className="group relative bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
                        <div className="relative space-y-8 py-12 p-8">
                            <img src="https://www.svgrepo.com/show/438615/health-insurance-round.svg" loading="lazy" width="200" height="200" className="w-12 h-12 rounded-full" style={{ color: 'transparent' }} />
                            <div className="space-y-2">
                                <h5 className="text-xl font-semibold text-white transition group-hover:text-secondary">Improved Health</h5>
                                <p className="text-gray-300">Managing your time effectively reduces stress and prevents burnout, leading to better mental and physical health.</p>
                                <Link href="https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work">
                                    <p className="text-secondary hover:text-white transition">Learn More</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="group relative bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
                        <div className="relative space-y-8 py-12 p-8">
                            <img src="https://www.svgrepo.com/show/55944/productivity.svg" loading="lazy" width="200" height="200" className="w-12 h-12 rounded-full" style={{ color: 'transparent' }} />
                            <div className="space-y-2">
                                <h5 className="text-xl font-semibold text-white transition group-hover:text-secondary">Increased Productivity</h5>
                                <p className="text-gray-300">Effective time management allows you to focus on what matters most, boosting your productivity and achieving your goals.</p>
                                <Link href="https://community.thriveglobal.com/boosting-your-productivity-with-simple-powerful-tools-improving-your-workflow-with-automation/">
                                    <p className="text-secondary hover:text-white transition">Learn More</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="group relative bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
                        <div className="relative space-y-8 py-12 p-8">
                            <img src="https://www.svgrepo.com/show/255157/goals-goal.svg" loading="lazy" width="200" height="200" className="w-12 h-12 rounded-full" style={{ color: 'transparent' }} />
                            <div className="space-y-2">
                                <h5 className="text-xl font-semibold text-white transition group-hover:text-secondary">Achieve Goals</h5>
                                <p className="text-gray-300">By organizing your time well, you set clear priorities and goals, making it easier to track progress and achieve desired outcomes.</p>
                                <Link href="https://hbr.org/2022/08/5-ways-to-set-more-achievable-goals">
                                    <p className="text-secondary hover:text-white transition">Learn More</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="group relative bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
                        <div className="relative space-y-8 py-12 p-8">
                            <img src="https://www.svgrepo.com/show/307708/career-dilemma-life-choices-priorities-work-life-balance.svg" loading="lazy" width="200" height="200" className="w-12 h-12 rounded-full" style={{ color: 'transparent' }} />
                            <div className="space-y-2">
                                <h5 className="text-xl font-semibold text-white transition group-hover:text-secondary">Better Work-Life Balance</h5>
                                <p className="text-gray-300">Good time management helps you balance work and personal life, leading to improved relationships and overall satisfaction.</p>
                                <Link href="https://health.economictimes.indiatimes.com/news/industry/work-life-balance-a-deep-mental-health-crisis-looms/114935368">
                                    <p className="text-secondary hover:text-white transition">Learn More</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="group relative bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
                        <div className="relative space-y-8 py-12 p-8">
                            <img src="https://www.svgrepo.com/show/492912/step-up-menbusiness.svg" loading="lazy" width="200" height="200" className="w-12 h-12 rounded-full" style={{ color: 'transparent' }} />
                            <div className="space-y-2">
                                <h5 className="text-xl font-semibold text-white transition group-hover:text-secondary">Career Growth</h5>
                                <p className="text-gray-300">Effective time management helps you stay organized and focused, which can lead to better career advancement opportunities.</p>
                                <Link href="https://vati.io/career-guide/accelerating-your-career-growth-strategies-and-techniques-for-advancement/">
                                    <p className="text-secondary hover:text-white transition">Learn More</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="group relative bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
                        <div className="relative space-y-8 py-12 p-8">
                            <img src="https://www.svgrepo.com/show/313850/donate-solid.svg" loading="lazy" width="200" height="200" className="w-12 h-12 rounded-full" style={{ color: 'transparent' }} />
                            <div className="space-y-2">
                                <h5 className="text-xl font-semibold text-white transition group-hover:text-secondary">Donate Now !!</h5>
                                <p className="text-gray-300">Your donation let us do more and more intresting stuff for you. Please spare time to donate a little amount. Your small support would very benificial for us.</p>
                                <Link href="/">
                                    <p className="text-secondary hover:text-white transition">Learn More</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainFeatures;
