import React from 'react';

export const EditIcon = function() {
	return (
		<svg width="23" height="23" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
			<title>edit</title>
			<path d="M11.42 9.78c.3-.55.45-1.17.45-1.84C11.87 5.76 10.1 4 7.94 4c-.4 0-.78.06-1.15.17l2.26 2.27c.34.34.34.9 0 1.24l-1.4 1.4c-.33.33-.9.33-1.23 0l-2.27-2.3c-.1.38-.17.76-.17 1.16 0 2.17 1.75 3.93 3.93 3.93.67 0 1.3-.16 1.84-.45l5.4 6.3c.3.36.85.38 1.2.04l1.38-1.4c.34-.33.32-.87-.05-1.18l-6.28-5.4z" fill="#00B0C5" fillRule="evenodd"/>
		</svg>
	)
}

export const RemoveIcon = function() {
	return (
		<svg width="23" height="23" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
			<title>remove</title>
			<path d="M16.9 14.64L13.24 11l3.64-3.64.08-.13c.05-.14.02-.3-.1-.4L15.2 5.1c-.12-.1-.27-.13-.4-.08-.05.02-.1.05-.14.1L11 8.74 7.36 5.1l-.13-.08c-.14-.05-.3-.02-.4.1L5.1 6.8c-.1.12-.13.27-.08.4.02.05.05.1.1.14L8.74 11 5.1 14.64l-.08.13c-.05.14-.02.3.1.4l1.7 1.72c.12.1.27.12.4.07.05-.02.1-.05.14-.1l3.64-3.6 3.64 3.63.13.08c.14.05.3.02.4-.1l1.72-1.7c.1-.12.12-.27.07-.4-.02-.05-.05-.1-.1-.14z" fill="#00B0C5" fillRule="evenodd"/>
		</svg>
	)
}

export const PowerIcon = function() {
	return (
		<svg width="23" height="23" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
			<title>power</title>
			<path d="M14 5.3v2.1c.57.24 1.1.6 1.54 1.04.94.95 1.46 2.2 1.46 3.54 0 1.34-.52 2.6-1.46 3.54-.95.94-2.2 1.46-3.54 1.46-1.34 0-2.6-.52-3.54-1.46C7.52 14.6 7 13.34 7 12c0-1.34.52-2.6 1.46-3.54.45-.45.97-.8 1.54-1.05V5.3c-2.9.85-5 3.53-5 6.7 0 3.87 3.13 7 7 7s7-3.13 7-7c0-3.17-2.1-5.85-5-6.7zM11 3h2v8h-2V3z" fill="#00B0C5" fillRule="evenodd"/>
		</svg>
	)
}

export const LoopIcon = function() {
	return (
		<svg width="23" height="23" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
			<title>loop</title>
			<path d="M16.22 7.2c-1.24-1.35-3.03-2.2-5-2.2-3.76 0-6.8 3.04-6.8 6.8H5.7c0-3.06 2.47-5.53 5.5-5.53 1.64 0 3.1.7 4.12 1.84l-2 2H18V5.4l-1.78 1.8zm.5 4.6c0 3.03-2.46 5.5-5.5 5.5-1.64 0-3.1-.7-4.1-1.83l1.97-2H4.4v4.68l1.78-1.78c1.25 1.36 3.03 2.2 5 2.2 3.76 0 6.8-3.03 6.8-6.78H16.7z" fill="#00B0C5" fillRule="evenodd"/>
		</svg>
	)
}

export const StopIcon = function() {
	return (
		<svg width="23" height="23" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
			<title>stop</title>
			<path fill="#00B0C5" d="M6 5h12v12H6" fillRule="evenodd"/>
		</svg>
	)
}

export const OpenIcon = function() {
	return (
		<svg width="12" height="8" viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg">
			<path stroke="#fff" fill="none" strokeWidth="2" d="M1 1 L6 6 L11 1"></path>
		</svg>
	)
}


export const LoadingRing = function() {
	return (
		<svg width="60" height="60" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
		  <defs>
		    <linearGradient id="circleGradient" x1="0" x2="0" y1="0%" y2="100%">
		      <stop offset="10%" stopColor="#681de2" />
		      <stop offset="95%" stopColor="#c22039"/>
		    </linearGradient>
				<mask id="middle">
					<circle cx="60" cy="60" r="40" fill="#000" strokeWidth="10" stroke="#fff"></circle>
				</mask>
				<clipPath id="bar">
					<rect id="loading-bar" x="45" y="0" width="30" height="120"></rect>
				</clipPath>
		  </defs>
			<g clipPath="url(#bar)">
		  	<circle id="loading-circle" fill="url(#circleGradient)" cx="60" cy="60" r="50" mask="url(#middle)"/>
			</g>
		</svg>
	)
}

export const ExternalLink = function() {
	return (
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 768 768">
			<path d="M576 384c-19.2 0-32 12.8-32 32v192c0 19.2-12.8 32-32 32h-352c-19.2 0-32-12.8-32-32v-352c0-19.2 12.8-32 32-32h192c19.2 0 32-12.8 32-32s-12.8-32-32-32h-192c-54.4 0-96 41.6-96 96v352c0 54.4 41.6 96 96 96h352c54.4 0 96-41.6 96-96v-192c0-19.2-12.8-32-32-32z"></path>
			<path d="M700.8 83.2c-3.2-6.4-9.6-12.8-16-16-3.2-3.2-9.6-3.2-12.8-3.2h-192c-19.2 0-32 12.8-32 32s12.8 32 32 32h115.2l-297.6 297.6c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 12.8 9.6 22.4 9.6s16-3.2 22.4-9.6l297.6-297.6v115.2c0 19.2 12.8 32 32 32s32-12.8 32-32v-192c0-3.2 0-9.6-3.2-12.8z"></path>
		</svg>
	)
}