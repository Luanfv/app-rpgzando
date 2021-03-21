import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { professions, races } from '../utils/rules';

export interface IAttributes {
  for: Number;
  con: Number;
  dex: Number;
  cha: Number;
  wis: Number;
  int: Number;
}

export interface IProfession {
  id: Number;
  name: String;
}

export interface IRace {
  id: Number;
  idSecondary: Number;
  name: String;
}

export interface ICreateICharacterData {
  id: String;
  name: String;
  level: Number;
  expertises: Number[];
  profession: IProfession;
  race: IRace;
}

interface ICard {
  id: String;
  name: String;
  level: Number;
  hp: Number;
  expertise: Number[];
  profession: IProfession;
  race: IRace;
  attributes: IAttributes;
  createdAt: String;
  updatedAt: String;
}

interface ICardsData {
  cards: ICard[];
  createCharacter: (_data: ICreateICharacterData) => Boolean;
  createCard: (_attributes: IAttributes, _hp: Number) => Boolean;
}

const CardsContext = createContext<ICardsData>({} as ICardsData);

export const CardsProvider: React.FC = ({ children }) => {
  const [cards, setCards] = useState([] as ICard[]);
  const [name, setName] = useState('' as String);
  const [level, setLevel] = useState(1 as Number);
  const [expertise, setExpertise] = useState([] as Number[]);
  const [profession, setProfession] = useState({} as IProfession);
  const [race, setRace] = useState({} as IRace);

  const updateCards = useCallback(
    async (newCards: ICard[]): Promise<Boolean> => {
      try {
        setCards(newCards);
        await AsyncStorage.setItem('@RPGZando:cards', JSON.stringify(newCards));

        return true;
      } catch (err) {
        return false;
      }
    },
    [],
  );

  const createCharacter = useCallback(
    (_data: ICreateICharacterData): Boolean => {
      try {
        if (_data.name.length < 1) {
          throw Error('Você precisa preencher um nome para seu personagem');
        }

        if (_data.level < 1) {
          throw Error('Você precisa possuir adicionar um nível válido');
        }

        const foundProfession = professions.find(
          (_profession) => _profession.id === _data.profession.id,
        );

        if (!foundProfession) {
          throw Error('Sua profissão não foi encontrada');
        }

        let quantityExpertise: Number = 0;

        foundProfession.expertises.forEach((_expertise) => {
          _data.expertises.forEach((id) => {
            if (id === _expertise.id) {
              quantityExpertise = Number(quantityExpertise) + 1;
            }
          });
        });

        if (foundProfession.quantityExpertise !== quantityExpertise) {
          throw Error(
            'Quantidade de perícias da profissão escolhida está incorreto',
          );
        }

        const foundRace = races.find(
          (_race) =>
            _race.id === _data.race.id &&
            _race.subRace === _data.race.idSecondary,
        );

        if (!foundRace) {
          throw Error('Raça selecionado não foi encontrada');
        }

        setName(_data.name);
        setLevel(_data.level);
        setProfession(_data.profession);
        setExpertise(_data.expertises);
        setRace(_data.race);

        return true;
      } catch (err) {
        return false;
      }
    },
    [],
  );

  const createCard = useCallback(
    (_attributes: IAttributes, _hp: Number): Boolean => {
      try {
        const date = new Date();
        const id = date.getTime();

        const newCard = {
          id: `RPGZando:${id}`,
          name: name,
          level: level,
          expertise: expertise,
          profession: profession,
          race: race,
          hp: _hp,
          attributes: _attributes,
          createdAt: `${date}`,
          updatedAt: `${date}`,
        } as ICard;

        const response = updateCards([...cards, newCard]);

        if (!response) {
          throw Error('not created card');
        }

        return true;
      } catch (err) {
        return false;
      }
    },
    [name, level, expertise, profession, race, updateCards, cards],
  );

  useEffect(() => {
    const getStorage = async () => {
      const storageCards = await AsyncStorage.getItem('@RPGZando:cards');

      if (storageCards) {
        setCards(JSON.parse(storageCards) as ICard[]);
      }
    };

    getStorage();
  }, []);

  return (
    <CardsContext.Provider value={{ cards, createCharacter, createCard }}>
      {children}
    </CardsContext.Provider>
  );
};

export function useCards(): ICardsData {
  const context = useContext(CardsContext);

  if (!context) {
    throw new Error('useCards must be used within an CardsProvider');
  }

  return context;
}
