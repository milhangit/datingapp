import { useState } from "preact/hooks";
import { useLocation } from "wouter";
import { Layout } from "../components/Layout";
import { api } from "../lib/api";

export function Login() {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [_, setLocation] = useLocation();

    const handleSendOtp = async () => {
        if (!phone) return;
        setLoading(true);
        try {
            const res = await api.auth.login(phone);
            if (res.success) {
                setStep('otp');
                if (res.dev_otp) alert(`Dev OTP: ${res.dev_otp}`);
            }
        } catch (e) {
            alert('Error sending OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!otp) return;
        setLoading(true);
        try {
            const res = await api.auth.verify(phone, otp);
            if (res.success) {
                // Redirect to app
                setLocation('/app');
            } else {
                alert('Invalid OTP');
            }
        } catch (e) {
            alert('Error verifying OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout showNav={false}>
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-slide-up">
                <div className="space-y-2">
                    <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">
                        Find Your <br /> <span className="text-primary-500">Spark</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Premium dating for meaningful connections.</p>
                </div>

                <div className="w-full max-w-xs space-y-4">
                    {step === 'phone' ? (
                        <>
                            <input
                                type="tel"
                                value={phone}
                                onInput={(e) => setPhone(e.currentTarget.value)}
                                placeholder="+1 (555) 000-0000"
                                className="input-field text-center text-lg"
                            />
                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="btn-primary w-full text-lg"
                            >
                                {loading ? 'Sending...' : 'Continue with Phone'}
                            </button>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                value={otp}
                                onInput={(e) => setOtp(e.currentTarget.value)}
                                placeholder="123456"
                                className="input-field text-center text-lg tracking-widest"
                                maxLength={6}
                            />
                            <button
                                onClick={handleVerify}
                                disabled={loading}
                                className="btn-primary w-full text-lg"
                            >
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>
                            <button
                                onClick={() => setStep('phone')}
                                className="text-sm text-slate-400 underline"
                            >
                                Change Number
                            </button>
                        </>
                    )}
                </div>

                <p className="text-xs text-slate-400">By continuing you agree to our Terms & Privacy Policy.</p>
            </div>
        </Layout>
    );
}
