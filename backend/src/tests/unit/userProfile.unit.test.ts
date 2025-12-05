import { mapUserProfileDbToApi, mapUserProfilePatchToUpdateData } from '../../controllers/user';

describe('User profile mapping', () => {
  it('maps DB payload to API shape including displayName/bio', () => {
    const now = new Date();
    const api = mapUserProfileDbToApi({
      userId: 'u-1',
      username: 'user1',
      onboardingCompleted: true,
      primaryLanguage: 'English',
      secondaryLanguage: ['Spanish'],
      profilePicture: null,
      country: 'USA',
      city: 'NYC',
      favoriteGenres: ['Drama'],
      favoriteMovies: ['tt0111161'],
      displayName: 'User One',
      bio: 'Cinephile',
      privateAccount: false,
      spoiler: false,
      createdAt: now,
      updatedAt: now,
    });

    expect(api.displayName).toBe('User One');
    expect(api.bio).toBe('Cinephile');
  });

  it('builds patch only for provided fields, preserving displayName when not sent', () => {
    const data = mapUserProfilePatchToUpdateData({
      username: 'newUser',
      favoriteGenres: ['Action'],
    });

    expect(data).toHaveProperty('username', 'newUser');
    expect(data).toHaveProperty('favoriteGenres', ['Action']);
    expect(data).not.toHaveProperty('displayName');
  });

  it('sets displayName and event lists when provided in patch', () => {
    const data = mapUserProfilePatchToUpdateData({
      displayName: 'Shown Name',
      eventsSaved: ['a', 'b'],
      eventsAttended: ['c'],
    });

    expect(data).toHaveProperty('displayName', 'Shown Name');
    expect(data).toHaveProperty('eventsSaved', ['a', 'b']);
    expect(data).toHaveProperty('eventsAttended', ['c']);
  });
});
