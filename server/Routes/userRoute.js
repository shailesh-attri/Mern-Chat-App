

// User Route
router.get('/:id', userAuthController.getUser)
router.get('/getAllUsers', userAuthController.getAllUsers)

router.put('/edit_profile', userAuthController.editProfile);
router.put('/:id/follow', userAuthController.followUser);
router.put('/:id/unFollow', userAuthController.unFollowUser);

router.patch('/change_avatar', userAuthController.changeAvatar);
router.delete('/delete_profile', userAuthController.deleteProfile)