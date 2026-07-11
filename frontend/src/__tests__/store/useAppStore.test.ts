/**
 * Tests for the Zustand app store.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../../store/useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useAppStore.setState({
      role: null,
      selectedVenue: 'atl-mbs',
      activeOpsTab: 'dashboard',
      showNotifications: false,
      showProfile: false,
      userProfile: null,
    })
  })

  describe('Role management', () => {
    it('initializes with null role', () => {
      expect(useAppStore.getState().role).toBeNull()
    })

    it('sets role to fan', () => {
      useAppStore.getState().setRole('fan')
      expect(useAppStore.getState().role).toBe('fan')
    })

    it('sets role to volunteer', () => {
      useAppStore.getState().setRole('volunteer')
      expect(useAppStore.getState().role).toBe('volunteer')
    })
  })

  describe('Venue selection', () => {
    it('initializes with atl-mbs as default venue', () => {
      expect(useAppStore.getState().selectedVenue).toBe('atl-mbs')
    })

    it('changes selected venue', () => {
      useAppStore.getState().setSelectedVenue('sea-lumen')
      expect(useAppStore.getState().selectedVenue).toBe('sea-lumen')
    })
  })

  describe('Notifications', () => {
    it('initializes with notifications array', () => {
      const { notifications } = useAppStore.getState()
      expect(notifications.length).toBeGreaterThan(0)
    })

    it('toggles notification panel', () => {
      expect(useAppStore.getState().showNotifications).toBe(false)
      useAppStore.getState().toggleNotifications()
      expect(useAppStore.getState().showNotifications).toBe(true)
    })

    it('closes profile when opening notifications', () => {
      useAppStore.setState({ showProfile: true })
      useAppStore.getState().toggleNotifications()
      expect(useAppStore.getState().showProfile).toBe(false)
      expect(useAppStore.getState().showNotifications).toBe(true)
    })

    it('marks a notification as read', () => {
      const { notifications } = useAppStore.getState()
      const unreadId = notifications.find(n => !n.read)?.id
      if (unreadId) {
        useAppStore.getState().markNotificationRead(unreadId)
        const updated = useAppStore.getState().notifications.find(n => n.id === unreadId)
        expect(updated?.read).toBe(true)
      }
    })

    it('adds a new notification', () => {
      const before = useAppStore.getState().notifications.length
      useAppStore.getState().addNotification({
        title: 'Test Alert',
        message: 'This is a test notification',
        time: 'Just now',
        type: 'info',
      })
      const after = useAppStore.getState().notifications.length
      expect(after).toBe(before + 1)
      expect(useAppStore.getState().notifications[0].title).toBe('Test Alert')
      expect(useAppStore.getState().notifications[0].read).toBe(false)
    })
  })

  describe('User Profile', () => {
    it('initializes with null profile', () => {
      expect(useAppStore.getState().userProfile).toBeNull()
    })

    it('sets user profile', () => {
      useAppStore.getState().setUserProfile({
        displayName: 'John Doe',
        email: 'john@test.com',
        photoURL: null,
      })
      const profile = useAppStore.getState().userProfile
      expect(profile?.displayName).toBe('John Doe')
      expect(profile?.email).toBe('john@test.com')
    })
  })

  describe('Ops Console tabs', () => {
    it('initializes with dashboard tab', () => {
      expect(useAppStore.getState().activeOpsTab).toBe('dashboard')
    })

    it('switches to roster tab', () => {
      useAppStore.getState().setActiveOpsTab('roster')
      expect(useAppStore.getState().activeOpsTab).toBe('roster')
    })
  })

  describe('Venues list', () => {
    it('has a non-empty venues array', () => {
      const { venues } = useAppStore.getState()
      expect(venues.length).toBeGreaterThan(0)
    })

    it('each venue has id, name, and city', () => {
      const { venues } = useAppStore.getState()
      for (const v of venues) {
        expect(v.id).toBeTruthy()
        expect(v.name).toBeTruthy()
        // city may be empty for some but should exist
        expect(typeof v.city).toBe('string')
      }
    })
  })
})
