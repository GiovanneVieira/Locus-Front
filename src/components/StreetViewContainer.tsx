import { useEffect, useRef } from 'react';

export function StreetView() {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const apiKey = "AIzaSyB9QI0kcQLaE0SCfq1Z1XL5L82TnyzOjlE";

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
                new window.google.maps.StreetViewPanorama(divRef.current, {
                    position: { lat: -23.5505, lng: -46.6333 },
                    pov: { heading: 100, pitch: 0 },
                });
            }
        };

        // Caso o google já esteja carregado (hot reload)
        if (window.google && window.google.maps) {
            (window as any).initMap();
        }
    }, []);

    return (
        <div style={{
            padding: '40px 20px',
            maxWidth: '1200px', // Ajuste para alinhar com o topo do seu site
            margin: '0 auto'
        }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>Localização</h3>
            <div
                ref={divRef}
                style={{
                    width: '100%',
                    height: '400px',
                    borderRadius: '12px', // Para combinar com os cards arredondados lá de cima
                    overflow: 'hidden',
                    border: '1px solid #333'
                }}
            />
        </div>
    );
}