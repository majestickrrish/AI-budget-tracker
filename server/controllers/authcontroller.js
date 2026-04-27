const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

// ─── Register ────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1. Validate input
 if (!name || !email || !password || !confirmPassword) {
  return sendError(res, {
    statusCode: 400,
    message: 'Name, email, password and confirm password are required.',
    code: 'MISSING_FIELDS',
    details: {
      required: ['name', 'email', 'password', 'confirmPassword'],
      received: Object.keys(req.body),
    },
  });
}

if (password !== confirmPassword) {
  return sendError(res, {
    statusCode: 400,
    message: 'Passwords do not match.',
    code: 'PASSWORD_MISMATCH',
  });
}
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, {
        statusCode: 400,
        message: 'Please provide a valid email address.',
        code: 'INVALID_EMAIL',
      });
    }

    if (password.length < 6) {
      return sendError(res, {
        statusCode: 400,
        message: 'Password must be at least 6 characters.',
        code: 'WEAK_PASSWORD',
      });
    }

    // 2. Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, {
        statusCode: 400,
        message: 'An account with this email already exists.',
        code: 'EMAIL_ALREADY_EXISTS',
      });
    }

    // 3. Create user (password hashed via pre-save hook in model)
    const user = await User.create({ name, email, password });

    // 4. Return success (no password in response)
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Account created successfully.',
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (err) {
    console.error('[register]', err.message);
    return sendError(res, {
      statusCode: 500,
      message: 'Something went wrong during registration.',
      code: 'REGISTER_FAILED',
      details: err.message,
    });
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return sendError(res, {
        statusCode: 400,
        message: 'Email and password are required.',
        code: 'MISSING_FIELDS',
      });
    }

    // 2. Find user (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return sendError(res, {
        statusCode: 401,
        message: 'Invalid email or password.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // 3. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, {
        statusCode: 401,
        message: 'Invalid email or password.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    // 5. Return token + user details
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Login successful.',
      data: {
        token,
        user: user.toSafeObject(),
      },
    });
  } catch (err) {
    console.error('[login]', err.message);
    return sendError(res, {
      statusCode: 500,
      message: 'Something went wrong during login.',
      code: 'LOGIN_FAILED',
      details: err.message,
    });
  }
};

// ─── Get Current User (/auth/me) ─────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    // req.userId is set by protect middleware
    const user = await User.findById(req.userId);

    if (!user) {
      return sendError(res, {
        statusCode: 404,
        message: 'User not found.',
        code: 'USER_NOT_FOUND',
      });
    }

    return sendSuccess(res, {
      statusCode: 200,
      message: 'User profile fetched successfully.',
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (err) {
    console.error('[getMe]', err.message);
    return sendError(res, {
      statusCode: 500,
      message: 'Something went wrong while fetching profile.',
      code: 'GET_ME_FAILED',
      details: err.message,
    });
  }
};

// ─── Test Protected ───────────────────────────────────────────────────────────
const testProtected = (req, res) => {
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Protected route accessed successfully.',
    data: {
      userId: req.userId,
      accessedAt: new Date().toISOString(),
    },
  });
};

module.exports = { register, login, getMe, testProtected };