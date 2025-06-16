"use client"
import { Button, cn } from '@heroui/react';
import type React from 'react';
import { IoSyncCircleOutline } from 'react-icons/io5';
/**
 * Props interface for the ButtonComponent
 * @interface ButtonProps
 */
export type ButtonProps = {
    /** Optional ID for the component */
    id?: string;
    /** Handler function for button click events */
    handleOnClick?: () => void;
    /** Text to display on the button */
    buttonText?: string;
    /** React node to be used as button icon */
    buttonIcon?: React.ReactNode;
    /** Custom className for styling the icon */
    iconClassName?: string;
    /** Custom className for styling the text */
    textClassName?: string;
    /** Custom className for styling the button */
    baseClassName?: string;
    /** Flag to determine if the button should display an icon */
    isIcon?: boolean;
    /** Custom background color for button */
    bgColor?: string;
    radius?: 'sm' | 'md' | 'lg' | 'full';
    ButtonVariant?:
    | 'solid'
    | 'bordered'
    | 'light'
    | 'flat'
    | 'faded'
    | 'shadow'
    | 'ghost';
    type?: 'button' | 'submit' | 'reset';
};
/**
 * A reusable button component that supports icons and custom styling
 *
 * @component
 * @example
 * ```tsx
 * <ButtonComponent
 *   buttonText="Click me"
 *   handleOnClick={() => console.log('clicked')}
 *   buttonIcon={<CustomIcon />}
 * />
 * ```
 */
export const ButtonComponent = ({
    id,
    handleOnClick = () => false,
    buttonText = 'Sync from HRMS',
    buttonIcon = <IoSyncCircleOutline />,
    iconClassName = '',
    radius,
    textClassName = '',
    isIcon = true,
    baseClassName = '',
    bgColor,
    ButtonVariant = 'light',
    type,
    ...rest
}: ButtonProps) => {
	return (
		<Button
			// Base styling with NextUI Button component
			className={cn(
				' border border-content2-200 rounded-[0.37rem] gap-1 h-[2.5rem] w-[10rem] transition-colors',
				bgColor
					? `${bgColor} hover:!${bgColor} data-[hover=true]:!${bgColor}`
					: 'bg-background hover:!bg-background data-[hover=true]:!bg-background', // Allow custom background color
				baseClassName, // Allow custom class overrides
			)}
			size='sm'
			radius={radius}
			variant={ButtonVariant}
			onPress={handleOnClick}
			type={type}
			id={`${id}-button`}
			{...rest}
		>
			{/* Render icon if isIcon is true */}
			{isIcon && (
				<div
					className={cn(
						'flex items-center justify-center',
						iconClassName, // Allow custom icon styling
					)}
				>
					{buttonIcon}
				</div>
			)}
			{/* Button text with customizable styling */}
			<p
				className={cn(
					'text-[0.875rem] font-source font-semibold ',
					textClassName, // Allow custom text styling
				)}
			>
				{buttonText}
			</p>
		</Button>
	);
};