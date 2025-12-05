import { View, Text, Image } from 'react-native';
import { formatRelativeTime } from '../_utils';
import { commentUserRowStyles, DEFAULT_AVATAR_SIZE } from '../styles/CommentUserRow.styles';

type CommentUserRowProps = {
  username: string | null | undefined;
  profilePicture?: string | null;
  timestamp?: string;
};

export default function CommentUserRow({
  username,
  profilePicture,
  timestamp,
}: CommentUserRowProps) {
  const name = username || 'Anonymous';
  const initials = name.charAt(0).toUpperCase();
  const avatarSize = DEFAULT_AVATAR_SIZE;

  const avatarDynamicStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
  };

  const formattedTimestamp = timestamp ? formatRelativeTime(timestamp) : null;

  return (
    <View style={commentUserRowStyles.container}>
      {profilePicture ? (
        <Image
          source={{ uri: profilePicture }}
          style={[commentUserRowStyles.avatar, avatarDynamicStyle]}
        />
      ) : (
        <View
          style={[
            commentUserRowStyles.avatar,
            avatarDynamicStyle,
            { backgroundColor: '#444' },
          ]}
        >
          <Text style={commentUserRowStyles.avatarText}>{initials}</Text>
        </View>
      )}
      <View style={commentUserRowStyles.textContainer}>
        <Text style={commentUserRowStyles.username}>{name}</Text>
        {timestamp && <Text style={commentUserRowStyles.timestamp}>{formattedTimestamp}</Text>}
      </View>
    </View>
  );
}
