        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        navyDark: '#0B192C',
                        navyHeading: '#0F172A',
                        navySub: '#1E293B',
                        corpBlue: '#2563EB',
                        corpBlueDark: '#1D4ED8',
                        corpBlueDeep: '#1E40AF',
                        pulseCyan: '#0EA5E9',
                        pulseSky: '#38BDF8',
                        blueTint: '#EFF6FF',
                        blueBorder: '#BFDBFE',
                        offWhite: '#F8FAFC',
                        lightGrey: '#F1F5F9',
                        borderSlate: '#E2E8F0',
                        mutedSlate: '#64748B'
                    },
                    keyframes: {
                        subtlePulse: {
                            '0%, 100%': { transform: 'scale(1)', opacity: '1' },
                            '50%': { transform: 'scale(1.15)', opacity: '0.75' }
                        },
                        pulseHaloBlue: {
                            '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(37, 99, 235, 0.7)' },
                            '70%': { transform: 'scale(1)', boxShadow: '0 0 0 8px rgba(37, 99, 235, 0)' },
                            '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(37, 99, 235, 0)' }
                        },
                        pulseCyanHalo: {
                            '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(14, 165, 233, 0.7)' },
                            '70%': { transform: 'scale(1)', boxShadow: '0 0 0 8px rgba(14, 165, 233, 0)' },
                            '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(14, 165, 233, 0)' }
                        }
                    },
                    animation: {
                        'subtle-pulse': 'subtlePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'pulse-halo-blue': 'pulseHaloBlue 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'pulse-halo-cyan': 'pulseCyanHalo 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }
                }
            }
        }
