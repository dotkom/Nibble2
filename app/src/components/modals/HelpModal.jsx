import React from 'react';

import { Modal, Button } from 'react-materialize';
/**
 * props:
 *  trigger
 */
export function HelpModal({trigger}){
  return (
    <Modal
      header="Hjelp"
      trigger={trigger}
    >
      <div>
        <b>Hvordan legger jeg inn penger?</b>
        <p>
          Du kan legge inn penger manuelt på appen etter du har logget inn eller du kan legge til med ditt kredittkort på online.ntnu.no under min profil.
        </p>
        <b>Det er tomt for en vare, hva gjør jeg?</b>
        <p>Det er funksjonalitet for automatisk varsling under utvikling men foreløpig må du sende mail til trikom@online.ntnu.no.</p>
        <b>Jeg fant en feil, hva gjør jeg?</b>
        <p>Legg til en issue på github.com/dotKom/nibble2/ eller send en mail til dotkom@online.ntnu.no</p>
      </div>
    </Modal>
  );
}