import React from 'react';

const SideBar = () => {
  return (
    <>
      <button 
        className="btn btn-outline-secondary rounded" 
        type="button" 
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample"
        aria-controls="offcanvasExample"
        style={{ marginTop: '65px', marginLeft: '10px' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
        </svg>
      </button>

      <div 
        className="offcanvas offcanvas-start" 
        id="offcanvasExample" 
        aria-labelledby="offcanvasExampleLabel"
        data-bs-backdrop="false"
        style={{
          marginTop: '65px',
          height: 'calc(94.5vh - 65px)',
          borderRight: '1px solid #dee2e6'
        }}
      >
        <div className="offcanvas-header">
          <h4 className="offcanvas-title" id="offcanvasExampleLabel" style={{ marginLeft: '20px' }}>Menu</h4>
          <button 
            type="button" 
            className="btn-close" 
            data-bs-dismiss="offcanvas" 
            aria-label="Close"
          />
        </div>
        <div style={{ borderBottom: '1px solid #dee2e6', width: '100%', marginBottom: '0.5rem' }}></div>
        <div className="offcanvas-body">
          <div className="nav flex-column">
            <ul className="list-group" style={{ border: 'none' }}>
              <div className="accordion" id="sidebarAccordion">
                <div className="accordion-item" style={{ border: 'none' }}>
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      style={{ 
                        fontSize: '1.2rem', 
                        height: '50px',
                        '--bs-accordion-btn-icon': 'none',
                        '--bs-accordion-btn-focus-border-color': 'none',
                        '--bs-accordion-btn-focus-box-shadow': 'none',
                        '--bs-accordion-active-bg': 'transparent',
                        '--bs-accordion-active-color': 'inherit'
                      }}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16" style={{ marginRight: '10px', marginTop: '3px' }}>
                       <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                       <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                    New Chat
                    </button>
                  </h2>
                </div>

                <div className="accordion-item" style={{ border: 'none' }}>
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#settingsCollapse" 
                      aria-expanded="false" 
                      aria-controls="settingsCollapse" 
                      style={{ 
                        fontSize: '1.2rem', 
                        height: '50px',
                        '--bs-accordion-btn-focus-border-color': 'none',
                        '--bs-accordion-btn-focus-box-shadow': 'none',
                        '--bs-accordion-active-bg': 'transparent',
                        '--bs-accordion-active-color': 'inherit'
                      }}
                    >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      fill="currentColor" 
                      className="bi bi-gear" 
                      viewBox="0 0 16 16" 
                      style={{ marginRight: '10px', marginTop: '3px' }}
                    >
                      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                    </svg>
                      Settings
                    </button>
                  </h2>
                  <div id="settingsCollapse" className="accordion-collapse collapse" data-bs-parent="#sidebarAccordion">
                    <div className="accordion-body">
                      <ul className="list-group" style={{ border: 'none' }}>
                        <a href="#" className="list-group-item list-group-item-action" style={{ border: 'none', fontSize: '1rem' }}>Profile</a>
                        <a href="#" className="list-group-item list-group-item-action" style={{ border: 'none', fontSize: '1rem' }}>Preferences</a>
                        <a href="#" className="list-group-item list-group-item-action" style={{ border: 'none', fontSize: '1rem' }}>Notifications</a>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="accordion-item" style={{ border: 'none' }}>
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#helpCollapse" 
                      aria-expanded="false" 
                      aria-controls="helpCollapse" 
                      style={{ 
                        fontSize: '1.2rem', 
                        height: '50px',
                        '--bs-accordion-btn-focus-border-color': 'none',
                        '--bs-accordion-btn-focus-box-shadow': 'none',
                        '--bs-accordion-active-bg': 'transparent',
                        '--bs-accordion-active-color': 'inherit'
                      }}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        fill="currentColor" 
                        className="bi bi-info-circle" 
                        viewBox="0 0 16 16" 
                        style={{ marginRight: '10px', marginTop: '3px' }}
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                      </svg>
                      Help
                    </button>
                  </h2>
                  <div id="helpCollapse" className="accordion-collapse collapse" data-bs-parent="#sidebarAccordion">
                    <div className="accordion-body">
                      <ul className="list-group" style={{ border: 'none' }}>
                        <a href="#" className="list-group-item list-group-item-action" style={{ border: 'none', fontSize: '1rem' }}>FAQ</a>
                        <a href="#" className="list-group-item list-group-item-action" style={{ border: 'none', fontSize: '1rem' }}>Contact Support</a>
                        <a href="#" className="list-group-item list-group-item-action" style={{ border: 'none', fontSize: '1rem' }}>Documentation</a>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;