import React, { useState } from 'react';
import { Play, ImageOff } from 'lucide-react';

// Define proper TypeScript interface for content items
interface ContentItem {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
}

// Sample preview content data with proper typing
const previewContent: ContentItem[] = [
  {
    id: 1,
    title: 'Estratégias de Marketing Digital',
    description: 'Aprenda as melhores estratégias para alavancar seu negócio nas redes sociais.',
    thumbnail: '/images/marketing-digital.jpg'
  },
  {
    id: 2,
    title: 'Vendas no Instagram',
    description: 'Descubra como transformar seguidores em clientes e aumentar suas vendas.',
    thumbnail: '/images/instagram-sales.jpg'
  },
  {
    id: 3,
    title: 'Criação de Conteúdo',
    description: 'Técnicas para criar conteúdo que engaja e converte sua audiência.',
    thumbnail: '/images/content-creation.jpg'
  },
  {
    id: 4,
    title: 'Tráfego Pago',
    description: 'Como investir em anúncios de forma inteligente para maximizar seu ROI.',
    thumbnail: '/images/paid-traffic.jpg'
  },
  {
    id: 5,
    title: 'Copywriting Persuasivo',
    description: 'Aprenda a escrever textos que vendem e convertem mais clientes.',
    thumbnail: '/images/copywriting.jpg'
  },
  {
    id: 6,
    title: 'Automação de Marketing',
    description: 'Ferramentas e estratégias para automatizar seus processos de marketing.',
    thumbnail: '/images/automation.jpg'
  }
];

interface ContentItemProps {
  item: ContentItem;
}

const ContentItem: React.FC<ContentItemProps> = ({ item }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  return (
    <div className="bg-manuflix-dark rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg">
      <div className="relative aspect-video bg-gradient-to-br from-manuflix-dark to-manuflix-gray">
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-manuflix-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Error state - shown if image fails to load */}
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-manuflix-dark p-4 text-center">
            <ImageOff className="text-manuflix-red mb-2" size={32} />
            <p className="text-sm text-manuflix-gray">Prévia não disponível</p>
          </div>
        ) : (
          /* Image with proper loading and error handling */
          <img 
            src={item.thumbnail} 
            alt={item.title} 
            className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        {/* Play button overlay - only show if image loaded successfully */}
        {!imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity hover:bg-opacity-30">
            <div className="bg-black bg-opacity-50 rounded-full p-4 hover:bg-manuflix-red transition-colors cursor-pointer transform hover:scale-110 duration-200">
              <Play className="text-white" size={24} />
            </div>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold mb-2 text-lg">{item.title}</h3>
        <p className="text-manuflix-gray text-sm">{item.description}</p>
      </div>
    </div>
  );
};

export const ContentPreview: React.FC = () => {
  return (
    <section className="py-16 bg-manuflix-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Conteúdo Exclusivo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {previewContent.map((item) => (
            <ContentItem key={item.id} item={item} />
          ))}
        </div>
        
        <div className="text-center mt-14">
          <button className="bg-manuflix-red text-white px-8 py-3 rounded font-bold hover:bg-opacity-80 transition-colors transform hover:scale-105 duration-200">
            Ver Mais Conteúdos
          </button>
        </div>
      </div>
    </section>
  );
};
