import { mapUserProfileDbToApi, mapUserProfilePatchToUpdateData } from '../../controllers/user.js';

describe('UserProfile events fields', () => {
  const baseProfile = {
    userId: 'user-123',
    username: 'tester',
    onboardingCompleted: true,
    primaryLanguage: 'English',
    secondaryLanguage: ['English'],
    profilePicture: null,
    country: null,
    city: null,
    favoriteGenres: [],
    favoriteMovies: [],
    displayName: null,
    bio: null,
    moviesToWatch: [],
    moviesCompleted: [],
    eventsSaved: ['event-a', 'event-b'],
    eventsAttended: ['event-c'],
    privateAccount: false,
    spoiler: false,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-02T00:00:00Z'),
  };

  it('maps saved and attended events through to API shape', () => {
    const result = mapUserProfileDbToApi(baseProfile);
    expect(result.eventsSaved).toEqual(['event-a', 'event-b']);
    expect(result.eventsAttended).toEqual(['event-c']);
  });

  it('defaults missing events arrays to empty arrays', () => {
    const result = mapUserProfileDbToApi({
      ...baseProfile,
      eventsSaved: null,
      eventsAttended: undefined,
    });
    expect(result.eventsSaved).toEqual([]);
    expect(result.eventsAttended).toEqual([]);
  });

  it('applies patch updates for eventsSaved/eventsAttended', () => {
    const patch = mapUserProfilePatchToUpdateData({
      eventsSaved: ['one', 'two'],
      eventsAttended: ['three'],
    });
    expect(patch.eventsSaved).toEqual(['one', 'two']);
    expect(patch.eventsAttended).toEqual(['three']);
  });

  it('clears events arrays when patch sets them to null', () => {
    const patch = mapUserProfilePatchToUpdateData({
      eventsSaved: null,
      eventsAttended: null,
    });
    expect(patch.eventsSaved).toEqual([]);
    expect(patch.eventsAttended).toEqual([]);
  });
});
