'use client';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCookie } from '@/utils/cookieManage';
import { setReduxAuthToken } from '@/redux/authSlice';

export const AuthReduxProvider: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const syncAuth = async () => {
      try {
        const cookie = await getCookie('fruitsflow-authentication');

        if (cookie?.value) {
          const parsed = JSON.parse(cookie.value);
          dispatch(setReduxAuthToken(parsed));
        }
      } catch (err) {
        console.error('Lỗi khi parse cookie:', err);
      }
    };

    syncAuth();
  }, [dispatch]);

  return null;
};
