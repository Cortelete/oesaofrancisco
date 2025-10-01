
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ModalType, AppointmentData } from './types';
import {
  CLINIC_NAME, INSTAGRAM_URL, LOCATION_URL, CLINIC_WHATSAPP_NUMBER,
  GOOGLE_REVIEW_URL, ADDRESS, TECHNICAL_RESPONSIBILITY, DEV_WHATSAPP_NUMBER,
  DEV_INSTAGRAM_URL, SUBTITLES, MAP_EMBED_URL,
  InfoIcon, InstagramIcon, CalendarIcon, StarIcon, MapPinIcon,
  TechIcon, QualityIcon, CareIcon, AccessibilityIcon
} from './constants';
import Modal from './components/Modal';

// Helper component for Star Rating
const StarRating: React.FC<{ onRate: (rating: number) => void }> = ({ onRate }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Sua opinião é importante!</h3>
        <div className="flex space-x-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
            key={star}
            className={`w-10 h-10 cursor-pointer transition-all duration-200 ${
                (hoverRating || rating) >= star ? 'text-red-500 fill-red-500' : 'text-gray-300'
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            />
        ))}
        </div>
        <button
            onClick={() => onRate(rating)}
            disabled={rating === 0}
            className="w-full px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            Avaliar
        </button>
    </div>
  );
};


const App: React.FC = () => {
    const [activeModal, setActiveModal] = useState<ModalType | null>(null);
    const [subtitleIndex, setSubtitleIndex] = useState(0);
    const [appointmentData, setAppointmentData] = useState<AppointmentData>({ name: '', age: '', issue: '' });
    const [devName, setDevName] = useState('');

    // State and refs for logo spinning animation
    const [logoRotation, setLogoRotation] = useState(0);
    const [isLogoSpinning, setIsLogoSpinning] = useState(false);
    const velocityRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);


    useEffect(() => {
        const interval = setInterval(() => {
            setSubtitleIndex((prevIndex) => (prevIndex + 1) % SUBTITLES.length);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    const stopLogoSpin = useCallback(() => {
        setIsLogoSpinning(false);
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        setLogoRotation(currentRotation => Math.round(currentRotation / 360) * 360);
        velocityRef.current = 0;
    }, []);

    const animateLogo = useCallback(() => {
        velocityRef.current *= 0.98; // Apply friction
        if (Math.abs(velocityRef.current) < 0.1) {
            stopLogoSpin();
            return;
        }
        setLogoRotation(rotation => rotation + velocityRef.current);
        animationFrameRef.current = requestAnimationFrame(animateLogo);
    }, [stopLogoSpin]);

    const handleLogoClick = useCallback(() => {
        velocityRef.current += 30; // Add impulse on click
        if (!isLogoSpinning) {
            setIsLogoSpinning(true);
            animationFrameRef.current = requestAnimationFrame(animateLogo);
        }
    }, [isLogoSpinning, animateLogo]);
    
    // Cleanup animation frame on component unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);


    const handleAppointmentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (parseInt(appointmentData.age, 10) < 18) {
            setActiveModal(ModalType.AGE_WARNING);
        } else {
            const message = encodeURIComponent(
`Olá! Gostaria de agendar uma avaliação cortesia.
Nome: ${appointmentData.name}
Idade: ${appointmentData.age}
Queixa Principal: ${appointmentData.issue}`
            );
            window.open(`https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${message}`, '_blank');
            setActiveModal(null);
            setAppointmentData({ name: '', age: '', issue: '' });
        }
    };
    
    const handleRating = (rating: number) => {
        if (rating === 5) {
            window.open(GOOGLE_REVIEW_URL, '_blank');
            setActiveModal(null);
        } else {
            setActiveModal(ModalType.FEEDBACK);
        }
    };

    const handleDevContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const message = encodeURIComponent(`Olá, vi o link da ${CLINIC_NAME} e quero um site igual! Meu nome é ${devName}.`);
        window.open(`https://wa.me/${DEV_WHATSAPP_NUMBER}?text=${message}`, '_blank');
        setActiveModal(null);
        setDevName('');
    };

    const renderModalContent = () => {
        switch (activeModal) {
            case ModalType.ABOUT:
                return (
                    <div className="text-center text-gray-800 p-2">
                        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800 animate-gradient">
                            Excelência em Cada Sorriso
                        </h2>
                        <p className="text-gray-600 mb-6 text-base">
                            Somos a maior rede de clínicas odontológicas do Brasil.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="flex items-start space-x-4 p-4 bg-red-50/50 rounded-lg border border-red-100 transition-all duration-300 hover:scale-105 hover:bg-red-50 hover:border-red-300">
                                <div className="text-red-600 mt-1 flex-shrink-0"><TechIcon /></div>
                                <div>
                                    <h3 className="font-bold text-gray-800">Tecnologia de Ponta</h3>
                                    <p className="text-gray-600 text-sm">Equipamentos modernos para diagnósticos precisos e tratamentos eficientes.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 bg-red-50/50 rounded-lg border border-red-100 transition-all duration-300 hover:scale-105 hover:bg-red-50 hover:border-red-300">
                                <div className="text-red-600 mt-1 flex-shrink-0"><QualityIcon /></div>
                                <div>
                                    <h3 className="font-bold text-gray-800">Qualidade Superior</h3>
                                    <p className="text-gray-600 text-sm">Compromisso com a excelência em cada procedimento para resultados duradouros.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 bg-red-50/50 rounded-lg border border-red-100 transition-all duration-300 hover:scale-105 hover:bg-red-50 hover:border-red-300">
                                <div className="text-red-600 mt-1 flex-shrink-0"><CareIcon /></div>
                                <div>
                                    <h3 className="font-bold text-gray-800">Atendimento Humanizado</h3>
                                    <p className="text-gray-600 text-sm">Cuidamos de você com empatia, criando uma experiência acolhedora e segura.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 bg-red-50/50 rounded-lg border border-red-100 transition-all duration-300 hover:scale-105 hover:bg-red-50 hover:border-red-300">
                                <div className="text-red-600 mt-1 flex-shrink-0"><AccessibilityIcon /></div>
                                <div>
                                    <h3 className="font-bold text-gray-800">Acessível a Todos</h3>
                                    <p className="text-gray-600 text-sm">Planos flexíveis para que todos possam realizar o sonho de um sorriso perfeito.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case ModalType.APPOINTMENT:
                return (
                    <form onSubmit={handleAppointmentSubmit} className="space-y-4 text-gray-800">
                        <h2 className="text-2xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800 animate-gradient">Agendar Avaliação Cortesia</h2>
                        <input type="text" placeholder="Seu Nome Completo" value={appointmentData.name} onChange={(e) => setAppointmentData({...appointmentData, name: e.target.value})} className="w-full p-3 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-1 focus:ring-red-500 focus:border-red-500" required />
                        <input type="number" placeholder="Sua Idade" value={appointmentData.age} onChange={(e) => setAppointmentData({...appointmentData, age: e.target.value})} className="w-full p-3 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-1 focus:ring-red-500 focus:border-red-500" required />
                        <textarea placeholder="o que mais precisa de atenção na sua saúde bucal?" value={appointmentData.issue} onChange={(e) => setAppointmentData({...appointmentData, issue: e.target.value})} className="w-full p-3 bg-white border border-gray-300 rounded-lg h-24 placeholder-gray-500 focus:ring-1 focus:ring-red-500 focus:border-red-500" required />
                        <button type="submit" className="w-full p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">Confirmar Agendamento</button>
                    </form>
                );
            case ModalType.AGE_WARNING:
                return (
                    <div className="text-center text-gray-800">
                        <h2 className="text-2xl font-bold mb-4 text-red-600">Atenção!</h2>
                        <p className="text-gray-600 mb-4">Para agendar, é necessário ter 18 anos ou mais. Peça a um responsável para entrar em contato e realizar o agendamento para você.</p>
                        <button onClick={() => setActiveModal(null)} className="w-full p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">Entendi</button>
                    </div>
                );
            case ModalType.RATING:
                return <StarRating onRate={handleRating} />;
            case ModalType.FEEDBACK:
                return (
                    <div className="text-center text-gray-800">
                        <h2 className="text-2xl font-bold mb-4">Como podemos melhorar?</h2>
                        <p className="mb-4 text-gray-600">Lamentamos por não atender 100% das suas expectativas. Seu feedback é crucial para nós. Por favor, envie sua sugestão para nosso e-mail de suporte.</p>
                        <p className="p-3 bg-gray-100 border border-gray-200 rounded-lg font-mono text-gray-700">contato@odontoexcellence.com.br</p>
                        <p className="text-xs mt-2 text-gray-500">(Funcionalidade de envio direto será implementada em breve)</p>
                    </div>
                );
            case ModalType.LOCATION:
                return (
                    <div className="text-gray-800 text-center">
                        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800 animate-gradient">Nossa Localização</h2>
                        <div className="overflow-hidden rounded-lg border border-gray-200 mb-4 h-64 md:h-80">
                            <iframe src={MAP_EMBED_URL} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                        <p className="mb-4 text-gray-600">{ADDRESS}</p>
                        <a href={LOCATION_URL} target="_blank" rel="noopener noreferrer" className="inline-block w-full p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">Abrir no Google Maps</a>
                    </div>
                );
            case ModalType.DEV_CONTACT:
                return (
                    <div className="text-gray-800 text-center">
                        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800 animate-gradient">Fale com o Desenvolvedor</h2>
                        <p className="text-gray-600 mb-6">Gostou deste site? A InteligenciArte.IA cria soluções digitais únicas e modernas para o seu negócio.</p>

                        <a
                            href={DEV_INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group w-full flex items-center justify-center p-3 mb-6 bg-gray-100 border border-gray-200 rounded-xl shadow-sm transition-all duration-300 ease-out hover:bg-red-50 hover:border-red-200"
                        >
                            <div className="flex-shrink-0 w-6 text-gray-600 group-hover:text-red-600 transition-colors"><InstagramIcon /></div>
                            <span className="ml-3 font-semibold text-gray-700 group-hover:text-red-700 transition-colors">Siga no Instagram</span>
                        </a>
                        
                        <form onSubmit={handleDevContactSubmit} className="space-y-4">
                             <p className="text-center text-gray-600 text-sm">Para iniciar a conversa no WhatsApp, confirme seu nome abaixo:</p>
                            <input type="text" placeholder="Seu Nome" value={devName} onChange={(e) => setDevName(e.target.value)} className="w-full p-3 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-1 focus:ring-red-500 focus:border-red-500" required />
                            <button type="submit" className="w-full p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">Quer um site incrível como esse? Fale comigo! 🚀</button>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    const LinkButton = ({ icon, text, action }: { icon: React.ReactElement; text: string; action: () => void }) => (
        <button
            onClick={action}
            className="group w-full flex items-center p-3 md:p-4 bg-white border border-gray-200 rounded-xl shadow-md transition-all duration-300 ease-out hover:bg-red-50 hover:scale-[1.03] hover:shadow-red-500/20 hover:border-red-300"
        >
            <div className="flex-shrink-0 w-6 md:w-8 text-red-600 group-hover:text-red-700 transition-colors">{icon}</div>
            <span className="flex-grow text-center font-semibold text-sm md:text-base text-gray-700 group-hover:text-gray-900 transition-colors">{text}</span>
        </button>
    );

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-white to-red-100 animate-gradient text-gray-800 flex flex-col items-center justify-between p-4 font-sans">
            
            <main className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-grow">
                <div className="w-full p-6 md:p-8 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl">
                    <header className="flex flex-col items-center text-center mb-8 [perspective:1000px]">
                        {/* 
                          IMPORTANTE: Crie uma pasta `public` na raiz do seu projeto
                          e coloque sua imagem de logo com o nome `logo.png` dentro dela.
                        */}
                        <img 
                            src="/logo.png" 
                            alt="Logo Odonto Excellence" 
                            className="w-28 h-28 md:w-32 md:h-32 rounded-full mb-4 border-2 border-white shadow-lg cursor-pointer"
                            onClick={handleLogoClick}
                            style={{
                                transform: `rotateY(${logoRotation}deg)`,
                                transition: isLogoSpinning ? 'none' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
                                transformStyle: 'preserve-3d'
                            }}
                            title="Clique em mim!"
                         />
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800 animate-gradient">
                            {CLINIC_NAME}
                        </h1>
                        <p className="text-sm md:text-base text-gray-600 mt-2 h-12 transition-opacity duration-700 ease-in-out">
                            {SUBTITLES[subtitleIndex]}
                        </p>
                    </header>

                    <nav className="space-y-4 mb-8">
                        <LinkButton icon={<InfoIcon />} text="O que é a Odonto Excellence" action={() => setActiveModal(ModalType.ABOUT)} />
                        <LinkButton icon={<InstagramIcon />} text="Instagram" action={() => window.open(INSTAGRAM_URL, '_blank')} />
                        <LinkButton icon={<CalendarIcon />} text="Agendar Avaliação Cortesia" action={() => setActiveModal(ModalType.APPOINTMENT)} />
                        <LinkButton icon={<StarIcon className="" />} text="Avalie nosso atendimento" action={() => setActiveModal(ModalType.RATING)} />
                        <LinkButton icon={<MapPinIcon />} text="Nossa Localização" action={() => setActiveModal(ModalType.LOCATION)} />
                    </nav>

                    <footer className="text-center text-xs text-gray-500">
                        <p>{TECHNICAL_RESPONSIBILITY}</p>
                    </footer>
                </div>
            </main>
            
            <footer className="w-full max-w-md mx-auto text-center py-4">
                <button 
                    onClick={() => setActiveModal(ModalType.DEV_CONTACT)}
                    className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                >
                    Desenvolvido por InteligenciArte.IA ✨
                </button>
            </footer>

            <Modal isOpen={activeModal !== null} onClose={() => setActiveModal(null)}>
                {renderModalContent()}
            </Modal>
        </div>
    );
};

export default App;
