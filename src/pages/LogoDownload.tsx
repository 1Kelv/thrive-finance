import React, { useRef } from 'react';
import { ThriveLogoFull } from '../assets/logos/ThriveLogoFull';
import { ThriveIcon } from '../assets/logos/ThriveIcon';
import { ThriveBanner } from '../assets/logos/ThriveBanner';

export const LogoDownload: React.FC = () => {
  const downloadSVG = (svgElement: SVGSVGElement | null, filename: string) => {
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const fullLogoRef = useRef<SVGSVGElement>(null);
  const iconWithBgRef = useRef<SVGSVGElement>(null);
  const iconNoBgRef = useRef<SVGSVGElement>(null);
  const bannerRef = useRef<SVGSVGElement>(null);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: 'var(--color-bg-secondary)' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
          Thrive Logo Assets
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: '3rem' }}>
          Download all Thrive logo variations for social media, app stores, and marketing materials
        </p>

        {/* Full Logo */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            Full Logo (Icon + Text)
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            Use for: Website header, email signatures, documents, presentations
          </p>
          <div style={{ 
            background: '#fff', 
            padding: '2rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'center',
            border: '1px solid var(--color-border)'
          }}>
            <ThriveLogoFull size={400} />
          </div>
          <button
            onClick={() => {
              const svg = document.querySelector('.full-logo-svg') as SVGSVGElement;
              downloadSVG(svg, 'thrive-logo-full.svg');
            }}
            className="btn btn-primary"
          >
            Download Full Logo (SVG)
          </button>
        </div>

        {/* Icon with Background */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            App Icon (With Background)
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            Use for: iOS/Android app icon, social media profile pictures, favicon
          </p>
          <div style={{ 
            background: '#f0f0f0', 
            padding: '2rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'center',
            border: '1px solid var(--color-border)'
          }}>
            <ThriveIcon size={200} background={true} />
          </div>
          <button
            onClick={() => {
              const svg = document.querySelector('.icon-with-bg-svg') as SVGSVGElement;
              downloadSVG(svg, 'thrive-icon-with-background.svg');
            }}
            className="btn btn-primary"
          >
            Download Icon with Background (SVG)
          </button>
        </div>

        {/* Icon without Background */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            Icon Only (Transparent)
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            Use for: Watermarks, overlays, flexible placement
          </p>
          <div style={{ 
            background: '#fff', 
            padding: '2rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'center',
            border: '1px solid var(--color-border)'
          }}>
            <ThriveIcon size={200} background={false} />
          </div>
          <button
            onClick={() => {
              const svg = document.querySelector('.icon-no-bg-svg') as SVGSVGElement;
              downloadSVG(svg, 'thrive-icon-transparent.svg');
            }}
            className="btn btn-primary"
          >
            Download Icon Transparent (SVG)
          </button>
        </div>

        {/* Social Media Banner */}
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            Social Media Banner
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            Use for: Twitter/X header, LinkedIn banner, Facebook cover, YouTube channel art
          </p>
          <div style={{ 
            background: '#fff', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1rem',
            overflow: 'auto',
            border: '1px solid var(--color-border)'
          }}>
            <ThriveBanner />
          </div>
          <button
            onClick={() => {
              const svg = document.querySelector('.banner-svg') as SVGSVGElement;
              downloadSVG(svg, 'thrive-banner-1500x500.svg');
            }}
            className="btn btn-primary"
          >
            Download Banner 1500x500 (SVG)
          </button>
        </div>

        {/* Hidden SVGs for download */}
        <div style={{ position: 'absolute', left: '-9999px' }}>
          <div className="full-logo-svg">
            <ThriveLogoFull size={500} />
          </div>
          <div className="icon-with-bg-svg">
            <ThriveIcon size={1024} background={true} />
          </div>
          <div className="icon-no-bg-svg">
            <ThriveIcon size={1024} background={false} />
          </div>
          <div className="banner-svg">
            <ThriveBanner />
          </div>
        </div>
      </div>
    </div>
  );
};