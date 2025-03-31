import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-manuflix-black text-manuflix-gray">
      <div className="container mx-auto px-4">
        <p className="mb-6">Dúvidas? Ligue 0800-123-4567</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div>
            <ul className="space-y-3">
              <li><a href="#" className="hover:underline">Perguntas frequentes</a></li>
              <li><a href="#" className="hover:underline">Relações com investidores</a></li>
              <li><a href="#" className="hover:underline">Formas de assistir</a></li>
            </ul>
          </div>
          
          <div>
            <ul className="space-y-3">
              <li><a href="#" className="hover:underline">Central de Ajuda</a></li>
              <li><a href="#" className="hover:underline">Carreiras</a></li>
              <li><a href="#" className="hover:underline">Termos de Uso</a></li>
            </ul>
          </div>
          
          <div>
            <ul className="space-y-3">
              <li><a href="#" className="hover:underline">Conta</a></li>
              <li><a href="#" className="hover:underline">Resgatar cartão pré-pago</a></li>
              <li><a href="#" className="hover:underline">Privacidade</a></li>
            </ul>
          </div>
          
          <div>
            <ul className="space-y-3">
              <li><a href="#" className="hover:underline">Media Center</a></li>
              <li><a href="#" className="hover:underline">Comprar cartão pré-pago</a></li>
              <li><a href="#" className="hover:underline">Preferências de cookies</a></li>
            </ul>
          </div>
        </div>
        
        <p className="text-sm">&copy; 2023 Manuflix. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};
