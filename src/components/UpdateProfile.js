import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);

      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const passwordConfirm = passwordConfirmRef.current.value;

      const promises = [];

      if (email !== currentUser.email && updateEmail) {
        promises.push(updateEmail(email));
      }

      if (password && updatePassword) {
        promises.push(updatePassword(password));
      }

      await Promise.all(promises);
      navigate('/');
    } catch (error) {
      console.error('Failed to update account:', error.message);
      setError('Failed to update account: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Update Profile</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control type='email' ref={emailRef} required defaultValue={currentUser.email} />
            </Form.Group>
            <Form.Group id='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' ref={passwordRef} placeholder='Leave blank to keep the same' />
            </Form.Group>
            <Form.Group id='password-confirm'>
              <Form.Label>Password Confirm</Form.Label>
              <Form.Control type='password' ref={passwordConfirmRef} placeholder='Leave blank to keep the same' />
            </Form.Group>
            <Button disabled={loading} className='w-100 mt-3' type='submit'>
              Update Profile
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'><Link to='/'>Cancel</Link></div>
    </>
  );
};

export default UpdateProfile;
