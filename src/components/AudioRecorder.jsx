import { useState, useRef, useEffect } from "react";
import {
  Button,
  Box,
  HStack,
  Icon,
  Progress,
  useColorModeValue,
  useColorMode,
  Flex,
} from "@chakra-ui/react";
import {
  FaMicrophone,
  FaStop,
  FaPlay,
  FaPause,
  FaTrash,
  FaRedo,
} from "react-icons/fa";
import RecordRTC from "recordrtc";
import WaveSurfer from "wavesurfer.js";

const MAX_RECORDING_TIME = 10; // 10 seconds
const AudioRecorder = ({ onAudioRecorded, openAudio }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recorderRef = useRef(null);
  const wavesurferRef = useRef(null);
  const timerRef = useRef(null);
  const bg = useColorModeValue("brand.light", "gray.800");
  const { colorMode } = useColorMode();
  const waveColor =
    colorMode === "light" ? "#212F3C" : "rgba(255, 255, 255, 0.5)";
  useEffect(() => {
    if (audioUrl) {
      wavesurferRef.current = WaveSurfer.create({
        container: "#waveform",
        waveColor: waveColor,
        progressColor: "teal",
        cursorColor: "transparent",
        barWidth: 2,
        barRadius: 3,
        responsive: true,
        height: 50,
        barGap: 3,
      });
      wavesurferRef.current.load(audioUrl);
      wavesurferRef.current.on("finish", () => setIsPlaying(false));
    }
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [audioUrl]);
  useEffect(() => {
    if (openAudio === "disabled") {
      deleteAudio();
    }
  }, [openAudio]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        recorderRef.current = new RecordRTC(stream, { type: "audio", mimeType: 'audio/mp3' });
        recorderRef.current.startRecording();
        setIsRecording(true);
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
          setRecordingTime((prevTime) => {
            if (prevTime >= MAX_RECORDING_TIME) {
              stopRecording();
              return MAX_RECORDING_TIME;
            }
            return prevTime + 1;
          });
        }, 1000);
      })
      .catch((err) => console.error("Error accessing microphone:", err));
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      clearInterval(timerRef.current);
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsRecording(false);
        convertToBase64(blob);
      });
    }
  };

  const convertToBase64 = (blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result.split(",")[1];
      onAudioRecorded(base64Audio);
    };
    reader.readAsDataURL(blob);
  };

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const deleteAudio = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }
    setAudioUrl(null);
    setIsPlaying(false);
    onAudioRecorded(null);
  };

  const reRecord = () => {
    deleteAudio();
    startRecording();
  };

  return (
    <>
      {openAudio === "enabled" && (
        <Box bg={bg} p={4} borderRadius="md">
          <HStack spacing={4} justify="center">
            {!isRecording && !audioUrl && (
              <Button
                onClick={startRecording}
                colorScheme="teal"
                leftIcon={<Icon as={FaMicrophone} />}
              >
                Record
              </Button>
            )}
            {isRecording && (
              <>
                <Button
                  onClick={stopRecording}
                  variant={"outline"}
                  colorScheme="red"
                  leftIcon={<Icon as={FaStop} />}
                >
                  {recordingTime}s / {MAX_RECORDING_TIME}s
                </Button>
              </>
            )}
            {audioUrl && (
              <Flex justifyContent={"center"} alignItems={"center"} gap={2}>
                <Button
                  colorScheme={colorMode === "dark" ? "" : "teal"}
                  onClick={togglePlayPause}
                  variant={"outline"}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </Button>
                <Button
                  colorScheme={colorMode === "dark" ? "" : "teal"}
                  onClick={deleteAudio}
                  variant={"outline"}
                >
                  <FaTrash />
                </Button>
                <Button
                  colorScheme={colorMode === "dark" ? "" : "teal"}
                  onClick={reRecord}
                  variant={"outline"}
                >
                  <FaRedo />
                </Button>
              </Flex>
            )}
          </HStack>
          {isRecording && (
            <Box
              my={4}
              px={4}
              py={3}
              border={"1px"}
              borderColor={!bg}
              rounded={"xl"}
            >
              <Progress
                rounded={"full"}
                value={(recordingTime / MAX_RECORDING_TIME) * 100}
                size={"xs"}
                colorScheme="teal"
              />
            </Box>
          )}
          {audioUrl && <Box id="waveform" width="100%" mt={4}></Box>}
        </Box>
      )}
    </>
  );
};

export default AudioRecorder
