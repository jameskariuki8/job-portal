import React from "react";
import './howItWorks.scss';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4
    }
  },
  hover: {
    x: 5,
    transition: {
      duration: 0.2
    }
  }
};

const HowItWorks = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="how"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.section 
        className="hero"
        variants={itemVariants}
      >
        <div className="wrap">
          <motion.div 
            className="icon"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🎯
          </motion.div>
          <motion.h1 variants={itemVariants}>
            How Essay Shop Works
          </motion.h1>
          <motion.p 
            className="sub"
            variants={itemVariants}
          >
            A simple, transparent workflow for creators and bidders – from posting to completion.
          </motion.p>
          <motion.div 
            className="cta"
            variants={itemVariants}
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/gigs')}
            >
              Browse Gigs
            </motion.button>
            <motion.button 
              className="ghost"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Grid */}
      <motion.div 
        className="grid stagger-children"
        variants={containerVariants}
      >
        {/* For Gig Creators */}
        <motion.div 
          className="card"
          variants={cardVariants}
          whileHover="hover"
        >
          <motion.div 
            className="badge"
            whileHover={{ scale: 1.1 }}
          >
            For Gig Creators
          </motion.div>
          <h2>Post your project in minutes</h2>
          <motion.ul variants={containerVariants}>
            {[
              { icon: '📝', text: '<strong>Create</strong> a gig with a clear title, category, detailed description, budget range, and delivery time.' },
              { icon: '📥', text: '<strong>Receive bids</strong> from qualified bidders. Each bid includes price, days, and a proposal message.' },
              { icon: '✅', text: '<strong>Approve</strong> one or more bidders to start – the gig moves to <em>In Progress</em>.' },
              { icon: '💬', text: '<strong>Message</strong> selected bidders to align on details; all messages are kept in your inbox.' },
              { icon: '🏁', text: '<strong>Complete</strong> the gig when satisfied. Leave a star rating and satisfaction review to build reputation.' }
            ].map((item, index) => (
              <motion.li
                key={index}
                variants={listItemVariants}
                whileHover="hover"
              >
                <span>{item.icon}</span>
                <div dangerouslySetInnerHTML={{ __html: item.text }} />
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* For Bidders */}
        <motion.div 
          className="card"
          variants={cardVariants}
          whileHover="hover"
        >
          <motion.div 
            className="badge purple"
            whileHover={{ scale: 1.1 }}
          >
            For Bidders
          </motion.div>
          <h2>Find work. Bid. Deliver.</h2>
          <motion.ul variants={containerVariants}>
            {[
              { icon: '🔎', text: '<strong>Discover gigs</strong> by browsing categories or searching keywords.' },
              { icon: '💰', text: '<strong>Place a bid</strong> within the creator\'s price range and delivery time. Share a thoughtful proposal (≥100 chars).' },
              { icon: '🚀', text: '<strong>Start working</strong> once approved. Collaborate via messages and deliver as agreed.' },
              { icon: '⭐', text: '<strong>Get rated</strong> after completion – great performance boosts your profile and future success.' }
            ].map((item, index) => (
              <motion.li
                key={index}
                variants={listItemVariants}
                whileHover="hover"
              >
                <span>{item.icon}</span>
                <div dangerouslySetInnerHTML={{ __html: item.text }} />
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Best Practices */}
        <motion.div 
          className="card"
          variants={cardVariants}
          whileHover="hover"
        >
          <motion.div 
            className="badge blue"
            whileHover={{ scale: 1.1 }}
          >
            Best Practices
          </motion.div>
          <h2>Tips for success</h2>
          <motion.ul variants={containerVariants}>
            {[
              { icon: '🧭', text: 'Write clear, scannable gig descriptions. Be explicit about scope and outcomes.' },
              { icon: '📆', text: 'Choose realistic timelines. Over‑deliver rather than over‑promise.' },
              { icon: '🧩', text: 'Keep communication inside Essay Shop messages for clarity and safety.' },
              { icon: '🔒', text: 'Only mark Complete when you\'re satisfied. Reviews help the whole community.' }
            ].map((item, index) => (
              <motion.li
                key={index}
                variants={listItemVariants}
                whileHover="hover"
              >
                <span>{item.icon}</span>
                <div>{item.text}</div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      {/* FAQ Section */}
      <motion.section 
        className="faq"
        variants={containerVariants}
      >
        <motion.h2 variants={itemVariants}>
          Frequently Asked Questions
        </motion.h2>
        <motion.div 
          className="items stagger-children"
          variants={containerVariants}
        >
          {[
            {
              question: 'Can I approve multiple bidders?',
              answer: 'Yes. Approve one or more bidders to work in parallel. The gig status becomes <em>In Progress</em> until you complete it.'
            },
            {
              question: 'How do payments work?',
              answer: 'Creators define budget ranges; bidders propose within that range. Use your preferred payment flow outside this demo or integrate a gateway.'
            },
            {
              question: 'What happens after completion?',
              answer: 'The gig moves to the Completed tab. Creators leave a star rating and satisfaction review that shows on the bidder\'s profile.'
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="item"
              variants={cardVariants}
              whileHover="hover"
            >
              <h3>{faq.question}</h3>
              <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default HowItWorks;