import { ShipWheelIcon } from 'lucide-react';
import { useState } from 'react'

import {Link} from 'react-router';
import {useLogin} from '../hooks/useLoginHook';
import { useThemeStore } from '../store/useThemeStore';


const LoginPage = () => {

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  //Without using custom hook, we did it
  // const queryClient = useQueryClient();

  // const { mutate, isPending, error} = useMutation({
  //   mutationFn: login, //login is an api call function in api.js
  //   onSuccess: () => queryClient.invalidateQueries( {queryKey: ["authUser"]}),
  // });

  const {isPending, error, loginMutation} = useLogin();
  const {theme} = useThemeStore();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  }

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme={theme} >
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
        {/* LOGIN FORM AREA */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
          {/* LOGO */}
          <div className='mb-4 flex items-center justify-start gap-2'>
            <ShipWheelIcon className='size-9 text-primary' />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent
             bg-gradient-to-r from-primary to-secondary -tracking-wider'>
              PingMe
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className='alert alert-error mb-4'>
              <span>{error?.response?.data?.message || "An unexpected error occured"}</span>
            </div>
          )}

          <div className='w-full'>
            <form onSubmit={handleLogin} className='space-y-6'>
              <div className='space-y-4'>
                <h2 className='text-xl font-semibold'>Welcome Back</h2>
                <p className='text-sm opacity-70'>Sign in to your account to continue your language journey</p>
              </div>

              <div className='flex flex-col gap-3'>
                <div className='form-control w-full space-y-1'>
                  <label className='label'>
                    <span className='label-text'>Email</span>
                  </label>
                    <input
                      type='email'
                      value={loginData.email}
                      className='input input-bordered w-full'
                      placeholder='example@gmail.com'
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                </div>
              </div>
              <div>
                <div className='form-control w-full space-y-1'>
                  <label className='label'>
                    <span className='label-text'>Password</span>
                  </label>
                  <input 
                   type="password" 
                   placeholder='***********'
                   value={loginData.password}
                   className='input input-bordered w-full'
                   onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                   required
                  />
                </div>
              </div>

              <button 
                type='submit'
                className='btn btn-primary w-full'
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className='loading loading-spinner loading-xs'></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className='text-center'>
                <p className='text-sm'>
                  Don't have an account? {" "}
                  <Link className='text-primary cursor-pointer hover:underline'
                    to="/signup"
                  >Create one
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
          <div className='max-w-md p-8'>
            <div className='relative aspect-square max-w-sm mx-auto'>
                <img src='/login_image.png' alt='Language connection Illustration' className='w-full h-full' />
            </div>
            <div className='text-center space-y-3 mt-6'>
              <h1 className='font-semibold text-xl'>Connect with language partners worldwide</h1>
              <p className='opacity-70'>Practice conversations, make friends, and improve your language skills together</p>
            </div>
          </div>
        </div>  
      </div>
    </div>
  )
}

export default LoginPage