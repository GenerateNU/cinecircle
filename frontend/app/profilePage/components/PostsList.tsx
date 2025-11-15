import React from 'react';
import { View, Text, Image } from 'react-native';
import tw from 'twrnc';
import { User } from '../types';
import { Feather } from '@expo/vector-icons';

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
            <View style={tw`flex-row justify-between w-4/5 mt-2`}>
              <View style={tw`flex-row items-center`}>
                <Feather name="heart" size={18} color="#111" />
                <Text style={tw`ml-1 text-[12px] text-gray-600`}>{p.likes}</Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Feather name="message-circle" size={18} color="#111" />
                <Text style={tw`ml-1 text-[12px] text-gray-600`}>{p.comments}</Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Feather name="repeat" size={18} color="#111" />
                <Text style={tw`ml-1 text-[12px] text-gray-600`}>{p.shares}</Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Feather name="send" size={18} color="#111" />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default PostsList;
