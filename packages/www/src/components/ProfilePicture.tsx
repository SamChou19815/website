import React, { useState } from 'react';
import Confetti from 'react-dom-confetti';

import { useDeveloperSamOnBirthday } from './global-states';

const confettiConfig = {
  angle: 180,
  spread: 360,
  startVelocity: 18,
  elementCount: 200,
  dragFriction: 0.1,
  duration: 2000,
  decay: 0,
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
};

const normalProfilePicture = (
  <img
    className="avatar__photo"
    src="/sam-by-megan-3-square.webp"
    alt="dev-sam fan art by dev-megan"
  />
);

export default function ProfilePicture(): JSX.Element {
  const onBirthday = useDeveloperSamOnBirthday();

  const [active, setActive] = useState(false);

  const startConfetti = () => {
    setActive(true);
    setTimeout(() => setActive(false), 2000);
  };

  if (onBirthday) {
    return (
      <>
        <Confetti active={active} config={confettiConfig} />
        <img
          className="avatar__photo birthday-profile-picture"
          src="/birthday-sam-by-megan-square.webp"
          alt="birthday-sam fan art by dev-megan"
          onClick={startConfetti}
        />
      </>
    );
  }

  return normalProfilePicture;
}
