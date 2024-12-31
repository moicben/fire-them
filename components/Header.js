import { useState } from 'react';
import navigation from '../navigation.json';
import annuaire from '../annuaire.json';

export default function Header({ }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header>
      <a className="logo" href='/'>
        <h4>Fire Them!</h4>
      </a>
      <button className="burger-menu" onClick={toggleMenu}>
        ☰
      </button>
      <nav className={isOpen ? 'open' : ''}>
        <ul>
          
          <li>
            <a href="/occupations">Occupations</a>
          </li>
          <li>
            <a href="/locations">Locations</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}