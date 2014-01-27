(function() {
	var scrolls = function(target_element_id, options) {			
		
		registerEvent = function(target_element, eventName, context, bubble) {
            target_element.addEventListener(eventName, context, bubble);
        };
		
		Scrolls	=	function(target_element_id, options) {
			
			this.target_element_id = target_element_id;
			
			this.section_class 			=	options.section_class || "section";			//class name of the content
			this.active_link_class 		=	options.active_link_class || "active";		// class name to apply selectd link
			this.scrollable_element_id 	=	options.scrollable_element_id;	
			this.scrollHandler			=	options.scrollHandler;
			
			this.initScrolls();
		}
		
		Scrolls.prototype = {
			
			initScrolls: function() {
				
				this.target_element = document.getElementById(this.target_element_id);
				
				//Get tab header links - <a>
				this.links = this.target_element.getElementsByTagName("a");
				
				this.scrollable_element = document.getElementById(this.scrollable_element_id);
				this.sections = this.scrollable_element.getElementsByClassName(this.section_class);
				
				//map the links and sections
				
				var _sections 	= this.sections,
					_links 		= this.links,
					_section_id, _link_href, tmp = {};
				
				for(var i = 0; i < _sections.length; i++) {
					var section_link = _sections[i].getElementsByTagName("a")[0].id;
					
					_section_id = "#" + section_link;
					
					for(var j = 0; j < _links.length; j++) {
						_link_href = _links[j];
						
						if(_section_id === _link_href.getAttribute("href")) {
							tmp[section_link] = _links[j];
						}
					}
				}
				
				this.sectionsAndLinksHash = tmp;
				
				//register scroll event;
				
				registerEvent(this.scrollable_element, "scroll", this, false);
				registerEvent(this.target_element, "click", this, false);
			},
			
			//default event hanlder for addEventListener;
			
			handleEvent: function (e) {
				
				if(e.type === "scroll") {
					this._handleScrollEvent(e);
				}
				else if(e.type === "click") {
					this._handleClickEvent(e);
				}
                
                e.preventDefault;
            },
			
			_handleClickEvent: function(e) {
			},
			
			_handleScrollEvent: function(e) {
				
				var sections				=	this.sections,
					scrolledHeight			=	this.scrollable_element.scrollTop,
					currentSectionStartPos	=	0,
					currentSectionHeight	=	0,
					currentSectionEndPos	=	0,
					currentSection;
                
                for(var i = 0; i < sections.length; i++) {
                    currentSection 			=	sections[i];
                    currentSectionHeight 	=	currentSection.clientHeight -1;
                    currentSectionEndPos 	=	currentSectionStartPos + currentSectionHeight;
					
                    if(scrolledHeight >= currentSectionStartPos && scrolledHeight <= currentSectionEndPos) {
						
						this.handleSelection(currentSection);
                        
						break;
                    }
                     currentSectionStartPos =   currentSectionEndPos;             
                }
				
			},
			handleSelection: function(currentSection) {
				
				var _prev_section_id = this.current_section_id,
					_current_section_id = currentSection.getElementsByTagName("a")[0].id;
				
				if(_prev_section_id !== _current_section_id) {
					//The content is changed
					this.hightLightSelectedLink(currentSection, _prev_section_id, _current_section_id);
				}
			},
			hightLightSelectedLink: function(currentSection, _prev_section_id, _current_section_id) {
				if(_prev_section_id) {
						var previous_link_ele = this.sectionsAndLinksHash[_prev_section_id];
						previous_link_ele.className = "";							//removes the active class;
					}		
					var current_link_ele = this.sectionsAndLinksHash[_current_section_id];
					current_link_ele.className = this.active_link_class;
				
				this.current_section_id = _current_section_id;
				
				
				
				if(typeof this.scrollHandler === "function") {
					this.scrollHandler(currentSection);
				}
			}
		}
		
		new Scrolls(target_element_id, options);
	}
	
	window.scrolls = scrolls;			//Sets scrolls as global
}())
