import { router, useLocalSearchParams } from 'expo-router';
import Rsvp from '../../components/Rsvp';

export default function RsvpScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const handleContinue = (response: 'yes' | 'maybe' | 'no' | null) => {
    console.log('RSVP Response:', response, 'for event:', eventId);
    router.back();
  };

  return <Rsvp eventId={eventId} onContinue={handleContinue} />;
}