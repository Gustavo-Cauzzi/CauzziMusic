import React, { useState } from 'react';

import { RectButton } from 'react-native-gesture-handler';

import { Container, Division1, Division2, OptionText } from './styles';

interface SwitchProps {
  options: String[];
  onChange?: () => void;
}

const Switch: React.FC<SwitchProps> = ({options, onChange}) => {
  const [divisionActive, setDivisionActive] = useState<'Division1' | 'Division2'>('Division1');

  function handleChangeValue(){
    setDivisionActive(lastValue => lastValue == 'Division1' ? 'Division2' : 'Division1')
    onChange && onChange();
  }

  return (
    <Container>
      <RectButton
        onPress={handleChangeValue}
        style={{flex: 1, flexDirection: 'row'}}
      >
        <Division1 isActive={divisionActive == 'Division1'}>
          <OptionText isActive={divisionActive == 'Division1'}>
            {options[0]}
          </OptionText>
        </Division1>
        <Division2 isActive={divisionActive == 'Division2'}>
          <OptionText  isActive={divisionActive == 'Division2'}>
            {options[1]}
          </OptionText>
        </Division2>
      </RectButton>
    </Container>
  );
};

export default Switch;
