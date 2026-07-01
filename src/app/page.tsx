"use client";

import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FloatingContactWidget from '../components/layout/FloatingContactWidget';
import HeroSection from '../components/sections/HeroSection';
import AdvantagesSection from '../components/sections/AdvantagesSection';
import ProductsSection from '../components/sections/ProductsSection';
import StatsSection from '../components/sections/StatsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import WarehouseSection from '../components/sections/WarehouseSection';
import FinalCTASection from '../components/sections/FinalCTASection';
import Modal from '../components/common/Modal';
import LeadForm from '../components/forms/LeadForm';
import CallbackForm from '../components/forms/CallbackForm';

export default function Home() {
  // Modal state managers
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModalTitle, setLeadModalTitle] = useState('Рассчитать стоимость');
  const [leadProductContext, setLeadProductContext] = useState('');
  const [leadSource, setLeadSource] = useState('hero');

  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Triggering primary leads forms (e.g. from Hero, Products, etc.)
  const openLeadModal = (sourceName: string, productContextVal?: string) => {
    setLeadSource(sourceName);
    if (productContextVal) {
      setLeadProductContext(productContextVal);
      setLeadModalTitle(`Заказать: ${productContextVal}`);
    } else {
      setLeadProductContext('');
      setLeadModalTitle('Рассчитать стоимость');
    }
    setIsLeadModalOpen(true);
  };

  const closeLeadModal = () => {
    setIsLeadModalOpen(false);
  };

  // Triggering callback requests
  const openCallbackModal = () => {
    setIsCallbackModalOpen(true);
  };

  const closeCallbackModal = () => {
    setIsCallbackModalOpen(false);
  };

  const openMessageModal = () => {
    setIsMessageModalOpen(true);
  };

  const closeMessageModal = () => {
    setIsMessageModalOpen(false);
  };

  return (
    <>
      {/* Persistent Page Header */}
      <Header onCallbackTrigger={openCallbackModal} />

      {/* Main Page Layout Sections */}
      <main>
        {/* Hero Banner Section */}
        <HeroSection onCtaTrigger={() => openLeadModal('hero_cta')} />

        {/* Benefits Grid */}
        <AdvantagesSection onCtaTrigger={() => openLeadModal('advantages_cta', 'Заказать')} />

        {/* Core Products Catalogue */}
        <ProductsSection />

        {/* Warehouse Capacity Overview */}
        <WarehouseSection onCtaTrigger={(subject) => openLeadModal('warehouse_cta', subject)} />

        {/* Statistical Numbers Grid */}
        <StatsSection />

        {/* Landmark Projects Showcases */}
        <ProjectsSection />

        {/* Bottom Contacts & Form split layout */}
        <FinalCTASection />
      </main>

      {/* Persistent Page Footer */}
      <Footer />

      {/* Expandable Persistent Floating Widget */}
      <FloatingContactWidget
        onCallbackTrigger={openCallbackModal}
        onMessageTrigger={openMessageModal}
      />

      {/* Modal: Main Lead Form */}
      <Modal open={isLeadModalOpen} title={leadModalTitle} onClose={closeLeadModal}>
        <LeadForm
          source={leadSource}
          productContext={leadProductContext}
          onSuccess={closeLeadModal}
          theme="light"
        />
      </Modal>

      {/* Modal: Callback Request Form */}
      <Modal open={isCallbackModalOpen} title="Заказать обратный звонок" onClose={closeCallbackModal}>
        <CallbackForm onSuccess={closeCallbackModal} />
      </Modal>

      {/* Modal: Quick Message Form */}
      <Modal open={isMessageModalOpen} title="Написать письмо" onClose={closeMessageModal}>
        <LeadForm
          source="quick_message"
          productContext="Сообщение из меню быстрой связи"
          onSuccess={closeMessageModal}
          theme="light"
          submitLabel="Отправить сообщение"
          commentLabel="Сообщение"
          commentPlaceholder="Напишите вопрос или детали заказа"
        />
      </Modal>
    </>
  );
}
