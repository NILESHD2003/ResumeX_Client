import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import { resumeStore } from '../../../stores/resumeStores';
import { useEditor } from '@tiptap/react';
import Section from './PreviewSections/Sections';
import EducationEntry from './PreviewSections/EducationEntry';
import SkillEntry from './PreviewSections/SkillEntry';
import LanguagesEntry from './PreviewSections/LanguagesEntry';
import ProfessionalExpEntry from './PreviewSections/ProfessionalExpEntry';
import CertificateEntry from './PreviewSections/CertificateEntry';
import ProjectEntry from './PreviewSections/ProjectEntry';
import AwardEntry from './PreviewSections/AwardEntry';
import CourseEntry from './PreviewSections/CourseEntry';
import OrganizationEntry from './PreviewSections/OrganizationEntry';
import PublicationEntry from './PreviewSections/PublicationEntry';
import ReferenceEntry from './PreviewSections/ReferenceEntry';
import DeclarationEntry from './PreviewSections/DeclarationEntry';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    backgroundColor: 'white'
  },
  section: {
    marginBottom: 10
  },
  jobTitle: {
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 12,
    marginRight: 15,
    color: '#000000',
    textDecoration: 'none'
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  text: {
    marginBottom: 3
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center'
  }
});

const metadata = {
  layout: {
        columns: "one",
        headerPosition: "top",
        sectionArrangement: [],
        twoRowSectionArrangement: []
    },
    spacing: {
        fontSize: 12,
        lineHeight: 1.1,
        paddingHorizontal: 30,
        paddingVertical: 30,
        spaceBetnEntries: 1
    },
    colors: {
        style: "basic",
        basicStyleOptions: {
            accent: "#000000",
            multiTheme: {
                textColor: "#000000",
                backgroundColor: "#000000",
                accentColor: "#000000",
            }
        },
        advancedStyleOptions: {
            accent: "#000000",
            multiTheme: {
                headerTextColor: "#000000",
                headerBackgroundColor: "#000000",
                headerAccentColor: "#000000",
                textColor: "#000000",
                backgroundColor: "#000000",
                accentColor: "#000000",
            }
        },
        borderStyleOptions: {
            accent: "#000000",
            borderSize: "S",
            showTop: true,
            showRight: true,
            showBotton: true,
            showLeft: true,
        },
        applyName: true,
        applyHeadings: true,
        applyHeadingsLink: true,
        applyHeaderIcons: false,
        applyDotsBarsBubbles: false,
        applyDates: false,
        applyLink: false,
    },
    font: {
        fontCategory: "serif",
        fontFamily: "Amiri"
    },
    heading: {
        headingStyle: "box",
        capitalization: "capitalize",
        size: "s",
        icons: "none",
    },
    entryLayout: {
        layoutType: "type1",
        titleSubtitleSize: "s",
        subtitleStyle: "normal",
        subtitlePlacement: "same-line",
        descriptionIndention: false,
        listStyle: "bullet"
    },
    header: {
        headerType: "left",
        detail: "tiled",
        infoStyle: "icon",
        iconShape: "none",
        detailOrder: ["mail", "github", "dob", "location"]
    },
    name: {
        nameSize: "XS",
        bold: true,
        font: "body",
        creativeFontOption: ""
    },
    jobTitle: {
        jobTitleSize: "S",
        position: "same-line",
        jobTitleStyle: "normal"
    },
    footer: {
        pageNo: false,
        email: false,
        name: false
    },
    skills: {
        layout: "bubble",
        layoutInfo: "none",
        subInfoStyle: "dash"
    },
    languages: {
        layout: "grid",
        layoutInfo: "grid-cols-2",
        subInfoStyle: "none"
    },
    certificates: {
        layout: "grid",
        layoutInfo: "grid-cols-2",
        subInfoStyle: "none"
    },
    profile: {
        showHeading: true
    },
    professionalExperience: {
        titleSubtitleOrder: "jobTitle-Employer",
    },
    education: {
        titleSubtitleOrder: "school-degree",
    },
    declaration: {
        showHeading: true,
        declarationPosition: "left",
        showLine: false
    },
    advancedOptions: {
        linkIcon: "none",
        reduceDateLocationOpacity: false
    },
    localizationSettings: {
        dateFormat: "DD/MM/yyyy"
    },
    photo: {
        showPhoto: true,
        size: "XS"
    }
}

function ResumePreview() {
    const {
        editingResume
    } = resumeStore();

    useEffect(() => {
        console.log(editingResume)
    }, [])

    const extractHandle = (url) => {
      if (!url) return '';
      try {
        const parsedUrl = new URL(url);
        const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
        return pathSegments[pathSegments.length - 1];
      } catch {
        return url;
      }
    };

  return (
    <Document style={{ backgroundColor: '#030712' }}>
        <Page size="A4" style={metadata.spacing}>
            <View style={styles.section}>
                {editingResume.profilePicture && (
                    <Image src={editingResume.profilePicture} style={styles.image} />
                )}
                <Text style={styles.header}>{editingResume.personalDetails.fullName}</Text>
                <Text style={styles.jobTitle}>{editingResume.personalDetails.jobTitle}</Text>
                 <View style={styles.contactContainer}>
                  {editingResume.personalDetails.email && (
                    <Text style={styles.contactText}>
                      {editingResume.personalDetails.email}
                    </Text>
                  )}
                  {editingResume.personalDetails.phone && (
                    <Text style={styles.contactText}>
                      {editingResume.personalDetails.phone}
                    </Text>
                  )}
                  {editingResume.personalDetails.socialLinks?.map((link, index) => (
                    <Link
                      key={index}
                      src={link.url}
                      style={styles.contactText}
                    >
                      {extractHandle(link.url)}
                    </Link>
                  ))}
                </View>
            </View>
            {editingResume.educationDetails.length > 0 && (
                <Section title="Education" type={metadata.heading.headingStyle}>
                  {editingResume.educationDetails?.map((edu) => (
                    <EducationEntry
                      key={edu._id}
                      title={edu.degree}
                      subtitle={edu.school}
                      grade={edu.grade}
                      location={`${edu.city}, ${edu.country}`}
                      date={`${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`}
                      description={edu.description}
                      style={metadata.education}
                    />
                  ))}
                </Section>
              )
            }
            {editingResume.languages?.length > 0 && (
              <Section title="Languages" type={metadata.heading.headingStyle}>
                <LanguagesEntry languages={editingResume.languages} style={metadata.languages} />
              </Section>
            )}
            {editingResume.skills.rankedSkills?.length > 0 && (
              <Section title="Skills" type={metadata.heading.headingStyle}>
                <SkillEntry skills={editingResume.skills} style={metadata.skills} />
              </Section>
            )}
            {editingResume.professionalExperience?.length > 0 && (
              <Section title="Professional Experience" type={metadata.heading.headingStyle}>
                {editingResume.professionalExperience.map((exp) => (
                  <ProfessionalExpEntry
                    key={exp._id}
                    title={exp.employer}
                    subtitle={exp.jobTitle}
                    location={`${exp.city}, ${exp.country}`}
                    date={`${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`}
                    description={exp.description}
                    style={metadata.professionalExperience}
                  />
                ))}
              </Section>
            )}
            {editingResume.certificates?.length > 0 && (
              <Section title="Certificates" type={metadata.heading.headingStyle}>
                <CertificateEntry certificates={editingResume.certificates} style={metadata.certificates} />
              </Section>
            )}
            {editingResume.projects?.length > 0 && (
              <Section title="Projects" type={metadata.heading.headingStyle}>
                {editingResume.projects.map((proj) => (
                  <ProjectEntry
                    key={proj._id}
                    title={proj.title}
                    subtitle={proj.subtitle}
                    description={proj.description}
                    startDate={proj.startDate}
                    endDate={proj.endDate}
                    links={proj.links}
                  />
                ))}
              </Section>
            )}
            {editingResume.awards?.length > 0 && (
              <Section title="Awards" type={metadata.heading.headingStyle}>
                {editingResume.awards.map((award) => (
                  <AwardEntry
                    key={award._id}
                    title={award.title}
                    issuer={award.issuer}
                    date={formatDate(award.date)}
                    link={award.link}
                  />
                ))}
              </Section>
            )}
            {editingResume.courses?.length > 0 && (
              <Section title="Courses" type={metadata.heading.headingStyle}>
                {editingResume.courses.map((course) => (
                  <CourseEntry
                    key={course._id}
                    title={course.title}
                    issuer={course.issuer}
                    date={`${formatDate(course.date)} - ${formatDate(course.expirationDate)}`}
                    link={course.link}
                    description={course.additionalInfo}
                  />
                ))}
              </Section>
            )}
            {editingResume.organizations?.length > 0 && (
              <Section title="Organizations" type={metadata.heading.headingStyle}>
                {editingResume.organizations.map((organization) => (
                  <OrganizationEntry
                    key={organization._id}
                    title={organization.name}
                    date={`${formatDate(organization.startDate)} - ${formatDate(organization.endDate)}`}
                    link={organization.link}
                    description={organization.description}
                    location={`${organization.city}, ${organization.country}`}
                  />
                ))}
              </Section>
            )}
            {editingResume.publications?.length > 0 && (
              <Section title="Publications" type={metadata.heading.headingStyle}>
                {editingResume.publications.map((publication) => (
                  <PublicationEntry
                    key={publication._id}
                    title={publication.title}
                    publisher={publication.publisher}
                    date={formatDate(publication.date)}
                    link={publication.link}
                    description={publication.description}
                  />
                ))}
              </Section>
            )}
            {editingResume.references?.length > 0 && (
              <Section title="References" type={metadata.heading.headingStyle}>
                {editingResume.references.map((reference) => (
                  <ReferenceEntry
                    key={reference._id}
                    name={reference.name}
                    jobTitle={reference.jobTitle}
                    organization={reference.organization}
                    link={reference.link}
                    email={reference.email}
                    phone={reference.phone}
                  />
                ))}
              </Section>
            )}
            {editingResume.declaration?.text && (
              <Section title="Declaration" type={metadata.heading.headingStyle}>
                <DeclarationEntry
                  text={editingResume.declaration.text}
                  signature={editingResume.declaration.signature}
                  date={editingResume.declaration.date}
                  place={editingResume.declaration.place}
                />
              </Section>
            )}
        </Page>
    </Document>
  )
}

const formatDate = (date) => {
  if (!date) return "Present";
  try {
    return format(new Date(date), "MM/yyyy");
  } catch {
    return "";
  }
};

export default ResumePreview;