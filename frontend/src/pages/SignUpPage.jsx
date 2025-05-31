import { useState } from 'react'
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import useSignup from '../hooks/useSignUpHook';
import { useThemeStore } from '../store/useThemeStore';

const SignUpPage = () => {

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  // const queryClient = useQueryClient();

  // const { mutate: signupMutation, isPending, error } = useMutation({
  //   mutationFn: signup,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }), //Refetch from app.jsx
  // });

  const {isPending, error, signupMutation} = useSignup();
  const {theme} = useThemeStore();

  const handleSignup = (e) => {
    e.preventDefault(); //Prevent the refresh
    signupMutation(signupData); //To call the mutationFn
    //mutate(signupData); signupMutation(signupData); both are same
  }

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme={theme}>
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-lg shadow-lg overflow-hidden'>
        {/* Signup form - left side */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
          {/* Logo */}
          <div className='mb-4 flex items-center justify-start gap-2'>
            <ShipWheelIcon className='size-9 text-primary' />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
              PingMe
            </span>
          </div>

          {/* Error Message*/}
          {
            error && (
              <div className='alert alert-error mb-4'>
                <span>{error.response.data.message}</span>
              </div>
            )
          }


          {/* Signup Form*/}
          <div className='w-full'>
            <form onSubmit={handleSignup}>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-xl font-semibold'>Create an Account</h2>
                  <p className='text-sm opacity-70'>Join PingMe and start your language learning journey!</p>
                </div>

                <div className='space-y-3'>
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>
                    <input type="text"
                      placeholder='Vibins V'
                      className='input input-bordered w-full'
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className='space-y-3'>
                    <div className='form-control w-full'>
                      <div className='label'>
                        <span className='label-text'>Email</span>
                      </div>
                      <input type="email"
                        placeholder='vibins@gmail.com'
                        className='input input-bordered w-full'
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className='space-y-3'>
                    <div className='form-control w-full'>
                      <div className='label'>
                        <span className='label-text'>Password</span>
                      </div>
                      <input type='password'
                        placeholder='*********'
                        className='input w-full input-bordered'
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                      />
                      <p className='text-xs pl-2 mt-1 opacity-70'>Password must be atleast six characters</p>
                    </div>
                  </div>
                  <div className='form-control'>
                    <label className='label justify-start gap-2 cursor-pointer'>
                      <input 
                      type='checkbox'
                      className='checkbox checkbox-sm'
                      required
                      />
                      <span className='text-xs leading-tight'>
                        I agree to the {" "}
                        <span className='text-primary hover:underline'>terms of service</span> and {" "}
                        <span className='text-primary hover:underline'>privacy policy.</span>
                      </span>
                    </label>
                  </div>

                  <button
                    type='submit'
                    className='btn btn-primary w-full'
                  >
                    {isPending ? (
                      <div>
                        <span className='loading loading-spinner loading-xs'></span>
                        Loading...
                      </div>
                    ) : (
                      "Create Account"
                    ) }
                  </button>

                  <div className='text-center mt-4'>
                    <p className='text-sm'>
                      Already have an account?{" "}
                      <Link 
                        to="/login"
                        className='text-primary hover:underline'
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/*Signup form right side*/}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
          <div className='max-w-md p-8'>
            {/*Image*/}
            <div className='relative aspect-square max-w-sm mx-auto'>
              <img src="/login_image.png" alt='Language connection illustration' className='w-full h-full' />
            </div>

            <div className='text-center space-y-3 mt-6'>
              <h2 className='text-xl font-semibold'>Connect With language partners Worldwide.</h2>
              <p>Pratice conversations, make friends, and improve your language skills together.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage

