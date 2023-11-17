import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { VoiceTypes } from "../lib/voices";

type Voice = {voiceType: VoiceTypes, voice: string, aiSetup: string}

interface Props {
  voices: Voice[]
  currentVoice: Voice
  onVoiceChange: (voiceType: Voice['voiceType']) => void
}

export const VoiceSelection: React.FC<Props> = ({ voices, currentVoice, onVoiceChange }) => (
    <RadioGroup defaultValue={currentVoice.voiceType} onChange={onVoiceChange}>
      <Stack spacing={5} direction="row">
        {voices.map((v, id) => (
          <Radio key={id} colorScheme="green" value={v.voiceType}>
            {v.voiceType}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );