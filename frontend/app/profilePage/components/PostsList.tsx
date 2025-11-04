import React from 'react';
import { View, Text, Image } from 'react-native';
import tw from 'twrnc';
import { User } from '../types';

type Props = {
  user: User;
};

const PostsList = ({ user }: Props) => {
  const posts = [
    {
      id: '1',
      text: `SRK in his lover era again and I'm not surviving this one.`,
      likes: '1.2k',
      comments: '340',
      shares: '120',
    },
    {
      id: '2',
      text: `Watched "3 Idiots" again — it still hits like the first time.`,
      likes: '980',
      comments: '210',
      shares: '75',
    },
  ];
  return (
    <View>
      {posts.map(p => (
        <View
          key={p.id}
          style={tw`flex-row rounded-[8px] bg-white mb-[10px] border-b border-[#eee] p-[15px]`}
        >
          <Image
            source={{ uri: user.profilePic }}
            style={tw`w-10 h-10 rounded-full mr-2.5`}
          />
          <View style={tw`flex-1`}>
            <Text style={tw`font-semibold`}>{user.name}</Text>
            <Text style={tw`text-[#333] my-1.5`}>{p.text}</Text>
            <View style={tw`flex-row justify-between w-4/5`}>
              <Text>❤️ {p.likes}</Text>
              <Text>💬 {p.comments}</Text>
              <Text>🔁 {p.shares}</Text>
              <Text>📤</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default PostsList;
