import { Flex, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { VoiceTypes } from "../lib/voices";
import Paragraph from "./paragraph";

type Voice = {voiceType: VoiceTypes, voice: string, aiSetup: string}

interface Props {
  voices: Voice[]
  currentVoice: Voice
  onVoiceChange: (voiceType: Voice['voiceType']) => void
}

function formatString(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export const VoiceSelection: React.FC<Props> = ({ voices, currentVoice, onVoiceChange }) => (
  <Flex flexDir={'column'} alignItems={'center'} gap={2}>
    <Paragraph style={{fontSize: 20}}>Beskrevet med stemmen til</Paragraph>
    <RadioGroup defaultValue={currentVoice.voiceType} onChange={onVoiceChange}>
      <Stack spacing={5} direction="row">
        {voices.map((v, id) => (
          <Radio key={id} colorScheme="green" value={v.voiceType}>
            {formatString(v.voiceType)}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
    </Flex>
  );