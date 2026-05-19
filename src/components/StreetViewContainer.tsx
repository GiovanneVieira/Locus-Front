import { useEffect, useRef } from 'react';

// 1. Tipagem para receber o endereço do formulário
interface StreetViewProps {
    address: string;
}

export function StreetView({ address }: StreetViewProps) {
    const divRef = useRef<HTMLDivElement>(null);

    // 2. Chave fixa para não dar tela branca (depois você volta pro .env se quiser)
    const apiKey = "AIzaSyB9QI0kcQLaE0SCfq1Z1XL5L82TnyzOjlE";

    useEffect(() => {
        // Se ainda não tiver endereço, não faz a busca
        if (!address) return;

        // Verifica se o script do Google já existe
        if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&v=weekly`;
            script.async = true;
            document.head.appendChild(script);
        }

        // Função global de inicialização
        (window as any).initMap = () => {
            if (divRef.current && window.google) {
                const geocoder = new window.google.maps.Geocoder();

                // Pega a string do endereço e converte em Lat/Lng
                geocoder.geocode({ address: address }, (results, status) => {
                    if (status === 'OK' && results && results[0]) {
                        new window.google.maps.StreetViewPanorama(divRef.current!, {
                            position: results[0].geometry.location,
                            pov: { heading: 100, pitch: 0 },
                        });
                    } else {
                        console.error('Falha ao encontrar endereço: ' + status);
                    }
                });
            }
        };

        // Se o Google já estiver carregado, roda direto
        if (window.google && window.google.maps) {
            (window as any).initMap();
        }
    }, [address]); // Recarrega se o endereço mudar

    // 3. Visual com Tailwind para não ficar achatado
    return (
        <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Localização</h2>
            <div
                ref={divRef}
                className="w-full h-[400px] rounded-2xl overflow-hidden border border-border"
            />
        </article>
    );
}