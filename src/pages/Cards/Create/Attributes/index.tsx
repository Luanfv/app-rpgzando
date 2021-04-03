/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState, useEffect } from 'react';

import { useCards } from '../../../../hooks/CardsContext';

import { professions, handleRace, IAttributes } from '../../../../utils/rules';

import Content from '../../../../components/Content';
import ProgressBar from '../../../../components/ProgressBar';
import InputNumeric from '../../../../components/InputNumeric';

import { Main, Title, Container } from '../style';

const Attributes: React.FC = () => {
  const { level, profession, race } = useCards();

  const [hp, setHp] = useState(level as Number);
  const [force, setForce] = useState(1 as Number);
  const [constitution, setConstitution] = useState(1 as Number);
  const [dexterity, setDexterity] = useState(1 as Number);
  const [charisma, setCharisma] = useState(1 as Number);
  const [wisdom, setWisdom] = useState(1 as Number);
  const [intelligence, setIntelligence] = useState(1 as Number);
  const [benefits, setBenefits] = useState({} as IAttributes);

  const fullHp = useMemo(() => {
    const found = professions.find(
      (_profession) => _profession.id === profession.id,
    );

    return Number(found?.hp);
  }, [profession.id]);
  const maxHp = useMemo(() => Number(level) * Number(fullHp), [fullHp, level]);

  useEffect(() => {
    const attributes = handleRace(race.id, race.idSecondary);

    if (attributes) {
      setBenefits(attributes);
    }
  }, [race.id, race.idSecondary]);

  return (
    <Content title="Nova Ficha" goBack>
      <Main>
        <ProgressBar phase={2} />

        <Container>
          <InputNumeric
            title={`HP: ${level}d${fullHp}`}
            value={Number(hp)}
            onChange={setHp}
            min={Number(level)}
            max={Number(maxHp)}
            random
          />
        </Container>

        <Title>Atributos</Title>

        <Container>
          <InputNumeric
            title={`Força (+${benefits.for})`}
            value={Number(force)}
            onChange={setForce}
            min={1}
            max={20}
            random
          />
          <InputNumeric
            title={`Destreza (+${benefits.dex})`}
            value={Number(dexterity)}
            onChange={setDexterity}
            min={1}
            max={20}
            random
          />
          <InputNumeric
            title={`Constituição (+${benefits.con})`}
            value={Number(constitution)}
            onChange={setConstitution}
            min={1}
            max={20}
            random
          />
          <InputNumeric
            title={`Inteligência (+${benefits.int})`}
            value={Number(intelligence)}
            onChange={setIntelligence}
            min={1}
            max={20}
            random
          />
          <InputNumeric
            title={`Sabedoria (+${benefits.wis})`}
            value={Number(wisdom)}
            onChange={setWisdom}
            min={1}
            max={20}
            random
          />
          <InputNumeric
            title={`Carisma (+${benefits.cha})`}
            value={Number(charisma)}
            onChange={setCharisma}
            min={1}
            max={20}
            random
          />
        </Container>
      </Main>
    </Content>
  );
};

export default Attributes;
