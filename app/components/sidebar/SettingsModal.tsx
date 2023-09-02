'use client';

import axios from 'axios';
import React, {use, useEffect, useState} from 'react'
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { User } from '@prisma/client';
import { CldUploadButton } from 'next-cloudinary';

import Input from "../inputs/Input";
import Modal from '@/app/components/Modal';
import Button from '../Button';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  currentUser = {}
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image
    }
  });

  const image = watch('image');

  const handleUpload = (result: any) => {
    setValue('image', result.info.secure_url, { 
      shouldValidate: true 
    });
  }

  const [isChecked, setIsChecked] = useState(currentUser.isDarkTheme || false);

  let checkTheme= currentUser.isDarkTheme
  let theme = ""
  if(checkTheme){
    theme = "dark"
  }
  else theme = "bright"

  localStorage.setItem("theme", theme)

  let divClassName = `py-4 px-4 border-t flex items-center gap-2 lg:gap-4 w-full`;

  if (theme == "dark") {
    divClassName += ` bg-gray-800 border-gray-900`;
  } else {
    divClassName += ` bg-white`;
  }

  const handleCheckboxChange = () => {
    setIsChecked(prevChecked => !prevChecked);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    // Add the isDarkTheme property to the data object
    data.isDarkTheme = isChecked;

    // Add the status property to the data object
    data.status = watch('status');

    axios.post('/api/settings', data)
        .then(() => {
          router.refresh();
          onClose();
        })
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your public information.
            </p>

            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name" 
                id="name" 
                errors={errors} 
                required 
                register={register}
              />
              <div>
                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <Image
                    width="48"
                    height="48" 
                    className="rounded-full" 
                    src={image || currentUser?.image || '/images/placeholder.jpg'}
                    alt="Avatar"
                  />
                  <CldUploadButton 
                    options={{ maxFiles: 1 }} 
                    onUpload={handleUpload} 
                    uploadPreset="oal1jcee"
                  >
                    <Button
                      disabled={isLoading}
                      secondary
                      type="button"
                    >
                      Change
                    </Button>
                  </CldUploadButton>
                </div>
              </div>


              <div>
                <label className="text-white block mb-1">Način putovanja</label>
                <select
                    value={watch('status')}
                    {...register('status')}
                >
                  <option value="" hidden>
                    Choose status
                  </option>
                  <option value="default">Default</option>
                  <option value="away">Away</option>
                  <option value="invisible">Invisible</option>
                </select>
              </div>



              <div>DARK MODE:
                <div>
                  <label className="theme-switch" htmlFor="checkbox">
                    <input
                        type="checkbox"
                        id="isDarkTheme"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                    <div className="slider round"></div>
                  </label>
                </div>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button 
            disabled={isLoading}
            secondary 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            disabled={isLoading}
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default SettingsModal;