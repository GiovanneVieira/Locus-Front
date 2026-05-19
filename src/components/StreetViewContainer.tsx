import { useEffect, useRef } from 'react';

// Adicionamos a tipagem para receber o endereço do formulário como propriedade
interface StreetViewProps {
    address: string;
}

export function StreetView({ address }: StreetViewProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const apiKey = import.meta.env.VITE_STREET_VIEW_API_KEY
    console.log(apiKey)

    useEffect(() => {
        // Se o endereço ainda não foi carregado, evita executar o mapa prematuramente
        if (!address) return;

        // Verifica se o script já existe para não carregar duplicado
        if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
            const script = document.createElement('script');
            // Use crases ` ` para que o ${apiKey} funcione
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&v=weekly`;
            script.async = true;
            document.head.appendChild(script);
        }

        // Função global de callback que o Google chama
        (window as any).initMap = () => {
            if (divRef.current && window.google) {
                // Criamos o Geocoder para buscar o endereço dinamicamente
                const geocoder = new window.google.maps.Geocoder();

                geocoder.geocode({ address: address }, (results, status) => {
                    if (status === 'OK' && results && results[0]) {
                        // Substituímos as coordenadas fixas pela posição encontrada pelo Geocoder
                        new window.google.maps.StreetViewPanorama(divRef.current!, {
                            position: results[0].geometry.location,
                            pov: { heading: 100, pitch: 0 },
                        });
                    } else {
                        console.error('Não foi possível encontrar o endereço cadastrado: ' + status);
                    }
                });
            }
        };

        // Caso o google já esteja carregado (hot reload)
        if (window.google && window.google.maps) {
            (window as any).initMap();
        }
    }, [address]); // Adicionado 'address' aqui para recarregar o mapa se o endereço mudar

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